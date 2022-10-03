import express from 'express';
import {signUp, signIn} from '../controller/auth.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.route("/login").post(signIn);
router.route("/signup").post(auth.checkDuplicateEmail, signUp);

export default router;