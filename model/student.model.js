import mongoose from "mongoose";

const Student = mongoose.model('Student', 
    new mongoose.Schema({
        studentId: String,
        email: String,
        password: String,
        firstName: String,
        lastName: String,
        listOfAppointment: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Appointment"
            }
        ]
    })
);

export default Student;