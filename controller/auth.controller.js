import dotenv from "dotenv";
import db from "../model/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

dotenv.config();
const Student = db.student;
const Tutor = db.tutor;

//hash 12 times

async function signUp(req, res, next) {
    const role = req.body.role.toLowerCase();
    
    if (role === "student") {
        const student = new Student({
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 12),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            listOfAppointment: req.body.listOfAppointment || []
        });

        student.save(err => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            res.send({ message: "register successfully!" });
        });
    }
    else if (role === "tutor") {
        const tutor = new Tutor({
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 12),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            listOfAppointment: req.body.listOfAppointment || []
        });

        tutor.save(err => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            res.send({ message: "register successfully!" });
        });
    }
    else {
        res.status(400).send({message: "This role doesn't exist"});
    }
}

async function signIn(req, res, next) {
    let role = req.body.role;
    if (!role) {
        role = "student";
    }
    role = role.toLowerCase();

    if (role !== "student" && role !== "tutor") {
        res.status(404).send({
            "message": `Failed! ${role} doesn't exist`
        });
        return;
    }  
    let User = Tutor;
    if (role === "student") {
        User = Student;
    }
    User.findOne({
        email: req.body.email
    })
    .exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (!user) {
            return res.status(404).send({ message: `${role} Not found.` });
        }
        
        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );
        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }
        var token = jwt.sign({ id: user.id, role: role }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: 86400 // 24 hours
        });

        res.json({
            id: user._id,
            role: role,
            email: user.email,
            accessToken: token
        });
    });
}

export {signUp, signIn};
