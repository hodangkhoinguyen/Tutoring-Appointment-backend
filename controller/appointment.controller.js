import db from "../model/index.js";

const Student = db.student;
const Tutor = db.tutor;
const Appointment = db.appointment;

async function getAppointment(req, res, next) {
    try {
        const role = req.role;
        const userId = req.userId;
        let appointmentId = {};
        if (role === "tutor") {
            appointmentId = (await Tutor.findById(userId)).listOfAppointment;
        }
        else if (role === "student") {
            appointmentId = (await Student.findById(userId)).listOfAppointment;
        }
        let appointment = [];
        if (appointmentId) {
            for (let i of appointmentId) {
                appointment.push(await Appointment.findById(i));
            }
        }
        res.json(appointment);
    }
    catch (e) {
        res.status(500).json({error: e.message});
    }
}

async function addAppointment(req, res, next) {
    try {
        const tutorId = req.body.tutorId;
        const studentId = req.body.studentId;
        const appointment = new Appointment({
            date: req.body.date,
            course: req.body.course,
            tutor: tutorId,
            student: studentId
        });
        await appointment.save();
        await Tutor.updateOne({_id: tutorId}, {$push: {listOfAppointment: appointment._id}});
        await Student.updateOne({_id: studentId}, {$push: {listOfAppointment: appointment._id}});

        res.json({status: "add appointment successfully"});
    }
    catch (e) {
        res.status(500).json({error: e.message});
    }
}

async function updateAppointment(req, res, next) {
    try {    
        await Appointment.updateOne({
            _id: req.body.appointmentId,
            studentId: req.body.studentId
        }, {
            date: req.body.date,
            course: req.body.course,
            tutorId: req.body.tutorId
        });
        
        res.json({status: "update appointment successfully"});
    }
    catch (e) {
        res.status(500).json({error: e.message});
    }
}

async function deleteAppointment(req, res, next) {
    try {    
        const appointmentId = req.body.appointmentId;
        const appointment = await Appointment.findById(appointmentId);
        if (appointment) {
            const tutorId = appointment.tutor;
            const studentId = appointment.student;
            await Appointment.deleteOne({
                _id: appointmentId
            });
            await Tutor.updateOne({_id: tutorId}, {$pull: {listOfAppointment: appointmentId}});
            await Student.updateOne({_id: studentId}, {$pull: {listOfAppointment: appointmentId}});
    
            res.json({status: "delete appointment successfully"});
        }
        else {
            throw new Error('no appointment');
        }
    }
    catch (e) {
        res.status(500).json({error: e.message});
    }
}

const appointmentCtrl = {getAppointment, addAppointment, updateAppointment, deleteAppointment};

export default appointmentCtrl;