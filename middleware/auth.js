import jwt from "jsonwebtoken";
import db from "../model/index.js";
import dotenv from "dotenv";

dotenv.config();

const Student = db.student;
const Tutor = db.tutor;

async function verifyToken(req, res, next) {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }

        req.userId = decoded.id;
        req.role = decoded.role;
        next();
    })
}

async function checkDuplicateEmail(req, res, next) {
    const role = req.body.role.trim().toLowerCase();
    
    if (role !== "student" && role !== "tutor") {
        res.status(404).send({
            "message": `Failed! Role ${role} doesn't exist`
        });
        return;
    }

    let User = Tutor;
    if (role === "student") {
        User = Student;
    }

    User.findOne({
        email: req.body.email
    }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (user) {
            res.status(400).send({ message: `Failed! Email is already used in ${role}!` });
            return;
        }
        next();
    })
}

const auth = {
    verifyToken,
    checkDuplicateEmail
}

export default auth;