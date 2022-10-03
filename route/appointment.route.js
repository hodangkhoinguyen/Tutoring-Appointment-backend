import express from 'express';
import appointmentCtrl from "../controller/appointment.controller.js";
import auth from '../middleware/auth.js';
const router = express.Router();

router.route("/")
    .get(auth.verifyToken, appointmentCtrl.getAppointment)
    .post(auth.verifyToken, appointmentCtrl.addAppointment)
    .put(auth.verifyToken, appointmentCtrl.updateAppointment)
    .delete(auth.verifyToken, appointmentCtrl.deleteAppointment);

export default router;