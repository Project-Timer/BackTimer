const mongoose = require('mongoose');
const schema = require('../models/timerModel');
const model = mongoose.model("Timer");

exports.setTimer = async (req, res) => {
    try {
        const filter = {
            project_id: req.body.project_id,
            user_id: req.user._id,
            dateEnd: null
        }

        model.findOne(filter, (error, result) => {
            if (error) {
                throw new Error(error)
            } else {
                if (result) {

                    const filter = {
                        _id: result._id
                    }

                    const update = {
                        dateEnd: Date.now()
                    }

                    model.findOneAndUpdate(filter, update, {new: true}, (error, updated) => {
                        if (error) {
                            throw new Error(error)
                        } else {
                            res.status(200);
                            res.json({
                                message: "Timer stopped",
                                active: false,
                                data: updated
                            });
                        }
                    });

                } else {

                    const newObject = new schema({
                        project_id: req.body.project_id,
                        user_id: req.user._id
                    });

                    newObject.save((error, created) => {
                        if (error) {
                            throw new Error(error)
                        } else {
                            res.status(200);
                            res.json({
                                message: "Timer started",
                                active: true,
                                data: created
                            });
                        }
                    });
                }
            }
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Error server'})
    }
};

exports.getTimerByProject = (req, res) => {
    try {
        const filter = {
            project_id: req.params.id
        }

        model.find(filter, (error, list) => {
            if (error) {
                throw new Error(error)
            } else {
                res.status(200);
                res.json(list);
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Error server'})
    }
};

exports.getTimerByUser = (req, res) => {
    try {
        const filter = {
            user_id: req.params.id
        }

        model.find(filter, (error, list) => {
            if (error) {
                throw new Error(error)
            } else {
                res.status(200);
                res.json(list);
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Error server'})
    }
};

exports.deleteTimer = (req, res) => {
    try {
        const filter= {
            "_id": req.params.id
        }

        model.remove(filter, (error) => {
            if (error) {
                throw new Error(error)
            } else {
                res.status(200);
                res.json({"message": "timer successfully removed"});
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Error server'})
    }
};