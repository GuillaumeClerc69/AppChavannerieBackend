const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./models/user');
const Appointment = require('./models/appointement');
const appointmentsRouter = require('./routes/appointments');
const Mailjet = require('node-mailjet');
const mailjet = Mailjet.apiConnect(`${process.env.MJ_APIKEY_PUBLIC}`, `${process.env.MJ_APIKEY_PRIVATE}`);
const moment = require('moment');
const dayjs = require('dayjs');
require('moment/locale/fr');
moment.locale('fr');
const { sendAppointmentEmail } = require('./utils/emails/emailRdvPsychiatre');
const { sendResetPasswordEmail } = require('./utils/emails/emailResetPassword');
const crypto = require('crypto');
const app = express();

app.use(cors());
app.use(bodyParser.json());
require('dotenv').config();
app.use(express.json());

mongoose.connect(`${process.env.MONGODB_DATABASE_URL}`, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

app.use('/appointments', appointmentsRouter);

function auth(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, 'jwtPrivateKey');
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
}

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findUserByEmail(email);
  if (!user) {
    return res.status(400).send('Invalid email or password.');
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).send('Invalid email or password.');
  }

  const token = jwt.sign({ _id: user._id, 
                          userType: user.userType,
                          firstname: user.firstname,
                          lastname: user.lastname,
                          email: user.email,
                          doctor: user.doctor,
                          roomnumber: user.roomnumber,
                          phone: user.phone,
                        },
                          'jwtPrivateKey');
  res.send(token);
});

app.get('/user/:id', auth, async (req, res) => {
  const { id } = req.params;

  console.log('Received ID:', id);
  
  try {
      const user = await User.findById(id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});

app.post('/resetPassword', async (req, res) => {
  const { email, lastname } = req.body; // Use req.body instead of req.query
  // Générer un token aléatoire de 20 caractères
  const randomtoken = crypto.randomBytes(20).toString('hex');

  try {
    const userData = await User.findOne({
      lastname: lastname,
      email: email,
    });

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    userData.resetPasswordToken = randomtoken;
    userData.resetPasswordExpires = Date.now() + 3600000; // Le token expire après une heure

    await userData.save();


    const userFirstname = userData.firstname;
    

    await sendResetPasswordEmail(userFirstname, lastname, email, randomtoken)

    res.json({ message: "Reset password email sent" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post('/reset-password', async (req, res) => {
  const { randomtoken, newPassword } = req.body;

  // Trouver l'utilisateur avec le token de réinitialisation du mot de passe valide
  const user = await User.findOne({
    resetPasswordToken: randomtoken,
  });

  if (!user) {
    // Si le token est invalide ou a expiré, on envoie une réponse avec un statut d'erreur et un message approprié
    return res.status(400).json({ message: "Le lien de réinitialisation du mot de passe est invalide ou a expiré. Veuillez renouveler votre demande." });
  }

  // Si le token est valide, on met à jour le mot de passe de l'utilisateur
  const saltRounds = 10; // Choisissez le nombre de tours qui vous convient
  user.password = await bcrypt.hash(newPassword, saltRounds); 
  user.resetPasswordToken = "";
  user.resetPasswordExpires = "";

  // Sauvegarder l'utilisateur mis à jour dans la base de données
  await user.save();

  res.status(200).json({ message: "Votre mot de passe a été réinitialisé avec succès." });
});


app.get('/patients', auth, async (req, res) => {
  const { firstname, lastname } = req.user;
  const { search } = req.query;
  
  try {
    let patients = await User.find({
      userType: 'patient',
      doctor: `${firstname} ${lastname}`
    });

    if (search) {
      patients = patients.filter(patient =>
        patient.firstname.toLowerCase().startsWith(search.toLowerCase())
      );
    }

    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/appointments', auth, async (req, res) => {
  const { patient, doctor, location, startHour, endHour, date, appointmentType, start, end} = req.body;

console.log('date au post: ', date)

  try {
    const newAppointment = new Appointment({
      patient,
      doctor,
      location,
      startHour,
      endHour,
      date,
      appointmentType
    });

    const [firstname, lastname,] = req.body.patient.split(' ');
    

    const patientData = await User.findOne({
      firstname,
      lastname,
      userType: 'patient'
    });

    if (!patientData) {
      return res.status(404).send('Patient non trouvé.');
    }

    const [doctorFirstname, doctorLastname] = req.body.doctor.split(' ');

    const doctorData = await User.findOne({
      firstname: doctorFirstname,
      lastname: doctorLastname,
      userType: 'psychiatre'
    });

    if (!doctorData) {
      return res.status(404).send('Docteur non trouvé.');
    }

    const doctorEmail = doctorData.email;
    const patientEmail = patientData.email;
    const patientFisrtname = patientData.firstname;
    const patientLastname = patientData.lastname;

    let momentObj = moment(date);
    let formattedDate = momentObj.format('dddd DD MMMM YYYY');

    await sendAppointmentEmail(patientEmail, patientFisrtname, patientLastname, doctor, formattedDate, startHour, endHour, location, date, doctorEmail);

    const savedAppointment = await newAppointment.save();

    res.status(200).json(savedAppointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});

module.exports = app;
