const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  phone: String,
  password: String,
  userType: String,
  roomnumber: String,
  doctor: String,
  psychologue: String,
  generaliste: String,
  resetPasswordToken: String,
  resetPasswordExpires: String,
});

userSchema.statics.findUserByEmail = async function(email) {
  try {
    const user = await this.findOne({ email });
    return user;
  } catch (err) {
    console.error(err);
    return null;
  }
}

const User = mongoose.model('User', userSchema);

// Fonction pour créer un utilisateur
const createUser = async (userData) => {
  try {
    const { email } = userData;

    // Vérifier si un utilisateur avec le même email existe déjà
    const existingUser = await User.findUserByEmail(email);
    if (existingUser) {
      console.log(`User with email ${email} already exists. Skipping creation.`);
      return;
    }

    // Hacher le mot de passe de manière asynchrone
    const hashedPassword = await bcrypt.hash('password', 10);

    // Créer l'utilisateur avec le mot de passe haché
    const newUser = new User({
      ...userData,
      password: hashedPassword,
    });
    await newUser.save();

    console.log(`User with email ${email} created successfully.`);
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

// Créer les utilisateurs d'échantillon
createUser({
  firstname: 'Super',
  lastname: 'Admin',
  email: 'superadmin@example.com',
  phone: '1234567890',
  userType: 'superAdmin',
  roomnumber: '',
  doctor: '',
  psychologue: '',
  generaliste: '',
  resetPasswordToken:'',
  resetPasswordExpires:'',
});

createUser({
  firstname: 'Admin',
  lastname: 'Activities',
  email: 'adminactivities@example.com',
  phone: '1234567890',
  userType: 'adminActivities',
  roomnumber: '',
  doctor: '',
  psychologue: '',
  generaliste: '',
  resetPasswordToken:'',
  resetPasswordExpires:'',
});

createUser({
  firstname: 'admin',
  lastname: 'jeux',
  email: 'adminjeux@example.com',
  phone: '1234567890',
  userType: 'adminJeux',
  roomnumber: '',
  doctor: '',
  psychologue: '',
  generaliste: '',
  resetPasswordToken:'',
  resetPasswordExpires:'',
});

createUser({
  firstname: 'patient',
  lastname: 'chavannerie',
  email: 'patientchavannerie1@example.com',
  phone: '1234567890',
  userType: 'patient',
  roomnumber: '',
  doctor: 'Docteur Rosier',
  psychologue: '',
  generaliste: '',
  resetPasswordToken:'',
  resetPasswordExpires:'',
});

createUser({
  firstname: 'Docteur',
  lastname: 'Rosier',
  email: 'docteurrosier@example.com',
  phone: '1234567890',
  userType: 'psychiatre',
  roomnumber: '',
  doctor: '',
  psychologue: '',
  generaliste: '',
  resetPasswordToken:'',
  resetPasswordExpires:'',
});

createUser({
  firstname: 'docteur',
  lastname: 'Madeleine',
  email: 'docteurmadeleine@example.com',
  phone: '1234567890',
  userType: 'psychologue',
  roomnumber: '',
  doctor: '',
  psychologue: '',
  generaliste: '',
  resetPasswordToken:'',
  resetPasswordExpires:'',
});

createUser({
  firstname: 'Guillaume',
  lastname: 'Clerc',
  email: 'guillaume_clerc@hotmail.com',
  phone: '0627650495',
  userType: 'patient',
  roomnumber: '13',
  doctor: 'Docteur Rosier',
  psychologue: '',
  generaliste: '',
  resetPasswordToken:'',
  resetPasswordExpires:'',
});

createUser({
  firstname: 'Jean',
  lastname: 'Dupond',
  email: 'guillaume.clerc.gc@gmail.com',
  phone: '1234567890',
  userType: 'patient',
  roomnumber: '',
  doctor: 'Docteur Rosier',
  psychologue: '',
  generaliste: '',
  resetPasswordToken:'',
  resetPasswordExpires:'',
});

module.exports = User;
