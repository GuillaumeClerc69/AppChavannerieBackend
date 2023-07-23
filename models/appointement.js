const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patient: {
    type: String,
    required: true
  },
  doctor: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  startHour: {
    type: String,
    required: true
  },
  endHour: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  appointmentType: {
    type: String,
    required: true
  }
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);

module.exports = Appointment;
