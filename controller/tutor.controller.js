import db from "../model/index.js";

const Student = db.student;
const Tutor = db.tutor;
const Appointment = db.appointment;

async function getTutor(req, res, next) {
    try {
        const tutor = await Tutor.find( {
                listOfCourse: req.params.course
            }
        );
        res.json(tutor);
    }
    catch (e) {
        res.status(500).json({error: e.message});
    }
}

async function getAvailability(req, res, next) {
    try {
        const tutorId = req.params.tutorId;
        if (!tutorId) {
            throw new Error({message: "No tutor"});
        }

        let availability = {};
        let today = new Date();

        let week = []; 
        for (let i = 1; i <= 7; i++) {
            let date = new Date();
            date.setDate(today.getDate()+i);
            week.push(date);
        }
        for (let i of tutorId) {
            let tutor = await Tutor.findById(i);
        
            let currAvailability = tutor.availability;

            for (let weekDay in currAvailability) {
                for (let day of week) {
                    if (day.getDay() == weekDay) {
                        if (!(day in availability)) {
                            availability[day] = [];
                        }
                        availability[day].push(
                            {
                                tutorId: i, 
                                tutorName: tutor.firstName + tutor.lastName,
                                slots: currAvailability[weekDay]
                            });
                    }
                }
            }
        }
        res.json(availability);
    }
    catch (e) {
        res.status(500).json({error: e.message});
    }
}

/*
    input of availability:
        0: [[start1, end1], [start2, end2]] (maynot be 30 minutes each)
        2: [[start1, end1], [start2, end2]] (maynot be 30 minutes each)

    output: divide start-end to multiple 30-minute sessions
*/
async function addAvailability(req, res, next) {
    try {
        const availability = req.body.availability;
        const tutorId = req.body.tutorId;
        Tutor.updateOne({_id: tutorId}, {$set:{"availability": availability}});
        res.json("updated succesfully availability");
    }
    catch (e) {
        res.status(500).json({error: e.message});
    }
}

/*
    input of availability:
        0: [start-end]
        2: [start-end]

    output: divide start-end to multiple 30-minute sessions
*/
async function update(req, res, next) {
    const availability = req.body.availability;
    const tutorId = req.body.tutorId;
    
}
export default {getTutor, getAvailability, addAvailability};