import mongoose from "mongoose";

const Appointment = mongoose.model('Appointment', 
    new mongoose.Schema({
        appointmentId: String,
        date: Date,
        course: String,
        tutor: mongoose.Schema.Types.ObjectId,
        student: mongoose.Schema.Types.ObjectId
    })
);

export default Appointment;