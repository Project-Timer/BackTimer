const mongoose = require('mongoose');
const TimerModel = require('../models/timerModel');
const timermodel = mongoose.model("Timer");

exports.setTimer = async (req, res) => {
    TimerModel.findOne({
        group: req.body.group,
        user: req.body.user
    }, (error, timer) => {
        if (error) {
            res.status(500);
            console.log(error);
            res.json({message: "Error server"});
        } else {
            if (timer) {
                const initTimer = new TimerModel({
                    group: req.body.group,
                    user: req.body.user,
                    dateEnd: Date.now()
                });

                TimerModel.findOneAndUpdate(
                    {'_id': timer._id},
                    {new: true},
                    (errors, timerUpdated) => {
                        if (errors) {
                            res.status(500);
                            console.log(errors);
                            res.json({message: "Error server"})
                        } else {
                            res.status(200);
                            res.json({message: timerUpdated});
                        }
                    }
                );
            } else {
                const initTimer = new TimerModel({
                    group: req.body.group,
                    user: req.body.user
                });

                initTimer.save((error, result) => {
                    if (error) {
                        res.status(500);
                        res.json({error: "Erreur serveur."});
                    } else {
                        res.status(200);
                        res.json({message: "Timer started"});
                    }
                });
            }
        }
    });
};

exports.getTimerById = (req, res) => {
    TimerModel.findById({"_id": req.params.id}, (error, timer) => {
        if (error) {
            res.status(500);
            console.log(error);
            res.json({message: "Error server"})
        } else {
            res.status(200);
            res.json(timer);
        }
    })
};

exports.getTimerByProject = (req, res) => {
    TimerModel.find({project: {project_id: req.params.id}}, (error, timer) => {
        if (error) {
            res.status(500);
            console.log(error);
            res.json({message: "Error server"})
        } else {
            res.status(200);
            res.json(timer);
        }
    })
};


exports.getTimerByUser = (req, res) => {
    TimerModel.find({user: {user_id: req.params.id}}, (error, timer) => {
        if (error) {
            res.status(500);
            console.log(error);
            res.json({message: "Error server"})
        } else {
            res.status(200);
            res.json(timer);
        }
    })
};

exports.deleteTimer = (req, res) => {
    TimerModel.remove({"_id": req.params.timer_id}, (error) => {
        if (error) {
            res.status(500);
            console.log(error);
            res.json({message: "Server Error."})
        } else {
            res.status(200);
            res.json({"message": "timer successfully removed"});
        }
    })
};