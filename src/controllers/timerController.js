const mongoose = require('mongoose');
const TimerModel = require('../models/timerModel');
const timermodel = mongoose.model("Timer");

exports.setTimer = async (req, res) => {
    try {
        timermodel.findOne({
            project_id: req.body.project_id,
            user_id: req.user._id,
            dateEnd: null
        }, (error, timer) => {
            if (error) {
                throw new Error(error)
            } else {
                if (timer) {
                    timermodel.findOneAndUpdate(
                        {_id: timer._id},
                        {dateEnd: Date.now()},
                        {new: true},
                        (error, timerUpdated) => {
                            if (error) {
                                throw new Error(error)
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
                            throw new Error(error)
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
    } catch (e) {
        console.log(e)
        res.status(500).json({message: 'Error server'})
    }
};

exports.getTimerByProject = (req, res) => {
    try {
        TimerModel.find({project_id: req.params.id},(error, list) => {
            if (error) {
                throw new Error(error)
            } else {
                res.status(200);
                res.json(list);
            }
        })
    } catch (e) {
        res.status(500).json({message: 'Error server'})
    }
};

exports.getTimerByUser = (req, res) => {
    try {
        TimerModel.find({user_id: req.params.id}, (error, list) => {
            if (error) {
                throw new Error(error)
            } else {
                res.status(200);
                res.json(list);
            }
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({message: 'Error server'})
    }
};

exports.deleteTimer = (req, res) => {
    try {
        TimerModel.remove({"_id": req.params.id}, (error) => {
            if (error) {
                throw new Error(error)
            } else {
                res.status(200);
                res.json({"message": "timer successfully removed"});
            }
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({message: 'Error server'})
    }
};