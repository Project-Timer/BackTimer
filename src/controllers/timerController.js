const mongoose = require('mongoose');
const TimerModel = require('../models/timerModel');
const GroupModel = require('../models/timerModel');
const timermodel = mongoose.model("Timer");
const groupmodel = mongoose.model("Group");
const userController = require('../controllers/userController');
const projectController = require('../controllers/projectController');

exports.setTimer = async (req, res) => {
    timermodel.findOne({
        project_id: req.body.project_id,
        user_id: req.user._id,
        dateEnd: null
    }, (error, timer) => {
        if (error) {
            res.status(500);
            console.log(error);
            res.json({message: "Error server - initial check"});
        } else {
            if (timer) {
                console.log(timer._id)
                timermodel.findOneAndUpdate(
                    {_id: timer._id},
                    {dateEnd: Date.now()},
                    {new: true},
                    (error, timerUpdated) => {
                        if (error) {
                            res.status(500);
                            console.log(error);
                            res.json({message: "Error server - update timer"})
                        } else {
                            res.status(200);
                            res.json({
                                message: "Timer stopped",
                                active: false,
                                data: timerUpdated
                            });
                        }
                    }
                );
            } else {
                const initTimer = new TimerModel({
                    project_id: req.body.project_id,
                    user_id: req.user._id
                });
                initTimer.save((error, result) => {
                    if (error) {
                        console.log(error);
                        res.status(500);
                        res.json({error: "Error server - Save new timer"});
                    } else {
                        res.status(200);
                        res.json({
                            message: "Timer started",
                            active: true,
                            data: result
                        });
                    }
                });
            }
        }
    });
};

exports.getTimersList = (req, res) => {
    TimerModel.find({}, (error, timer) => {
        if (error) {
            res.status(500);
            console.log(error);
            res.json({message: "Server Error."})
        } else {
            res.status(200);
            res.json(timer);
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
    TimerModel.find({
        project: {
            $elemMatch: {
                project_id: req.params.id
            }
        }
    }, (error, timer) => {
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
    TimerModel.find({
        user: {
            $elemMatch: {
                user_id: req.params.id
            }
        }
    }, (error, timer) => {
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
    TimerModel.remove({"_id": req.params.id}, (error) => {
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