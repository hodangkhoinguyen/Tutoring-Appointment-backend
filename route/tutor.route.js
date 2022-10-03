import express from 'express';
import tutorCtrl from '../controller/tutor.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.route('/:course').get(tutorCtrl.getTutor);
router.route('/availability/:tutorId').post(tutorCtrl.getAvailability);
router.route('/add-availability').post(auth.verifyToken, tutorCtrl.addAvailability);

export default router;