const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointement'); // Remplacez par le chemin vers votre modèle de rendez-vous


router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find(); // Récupère tous les rendez-vous
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
