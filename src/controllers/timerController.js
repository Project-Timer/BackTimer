const mongoose = require('mongoose')
const schema = require('../models/timerModel')
const model = mongoose.model("Timer")
const timerService = require('../services/timers.services')
const projectService = require('../services/projects.services')
const ApplicationError = require('../errors/application.errors')

exports.setTimer = async (req, res) => {
    try {
        const user = req.user._id
        const isActive = await timerService.isActive(user)

        if (isActive) {
            const filter = {
                _id: isActive._id
            }

            const update = {
                dateEnd: Date.now()
            }

            model.findOneAndUpdate(filter, update, {new: true}, (error, updated) => {
                if (error) console.log(error)
                res.status(200).json({
                    message: "Timer stopped",
                    active: false,
                    data: updated
                })
            })

        } else {
            const project = req.body.project_id
            const projectExist = await projectService.getProject(project)

            if (projectExist) {
                const newObject = new schema({
                    project_id: project,
                    user_id: user
                })

                newObject.save((error, created) => {
                    if (error) console.log(error)
                    res.status(200).json({
                        message: "Timer started",
                        active: true,
                        data: created
                    })
                })

            } else {
                throw new ApplicationError("The project does not exist", 500)
            }
        }
    } catch (error) {
        errorHandler(error, res)
    }
}

exports.getTimerByProject = (req, res) => {
    try {
        const filter = {
            project_id: req.params.id
        }

        model.find(filter, (error, result) => {
            if (error) console.log(error)
            res.status(200).json(result)
        })
    } catch (error) {
        errorHandler(error, res)
    }
}

exports.getTimerByUser = (req, res) => {
    try {
        const filter = {
            user_id: req.params.id
        }

        model.find(filter, (error, result) => {
            if (error) console.log(error)
            res.status(200).json(result)
        })

    } catch (error) {
        errorHandler(error, res)
    }
}

exports.deleteTimer = (req, res) => {
    try {
        const filter= {
            _id: req.params.id
        }

        model.remove(filter, (error) => {
            res.status(200).json({"message": "timer successfully removed"})
            if (error) console.log(error)
        })
    } catch (error) {
        errorHandler(error, res)
    }
}