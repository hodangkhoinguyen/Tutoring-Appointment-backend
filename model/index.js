import mongoose from 'mongoose';
import Appointment from './appointment.model.js';
import Student from './student.model.js';
import Tutor from './tutor.model.js';

// mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
db.appointment = Appointment;
db.student = Student;
db.tutor = Tutor;

export default db;
