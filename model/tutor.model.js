import mongoose from "mongoose";

const Tutor = mongoose.model('Tutor', 
    new mongoose.Schema({
        tutorId: String,
        email: String,
        password: String,
        firstName: String,
        lastName: String,
        /**
            availability format:
            0: [[start1, end1], [start2, end2]] (30 minutes each)
            1: [[start1, end1], [start2, end2]] 
            ...

            0: Sun -> 1: Mon -> 2: Tue ...
         */
        availability: [Object],
        listOfCourse: [String],
        listOfAppointment: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Appointment"
            }
        ]
    })
);

export default Tutor;