const mongoose = require('mongoose')
const schema = require('../models/timerModel')
const Model = mongoose.model("Timer")
const projectService = require('../services/projects.services')
const userService = require('../services/users.services')
const timerService = require('../services/timers.services')
const ApplicationError = require('../errors/application.errors')
const {errorHandler} = require('../utils/errorsHandler')

exports.setTimer = async (req, res) => {
    try {
        const project = req.body.project
        const exist = await projectService.exists(project)
        if (!exist) throw new ApplicationError("The project provided does not exist")

        const user = req.user._id

        const filter = {
            user: user,
            dateEnd: null
        }

        const isActive = await Model.findOne(filter, (error, result) => {
            if (error) console.log(error)
            return !!result;
        });

        if (isActive) {
            const filter = {
                _id: isActive._id
            }

            const update = {
                dateEnd: Date.now()
            }

            Model.findOneAndUpdate(filter, update, {new: true}, async (error, updated) => {
                if (error) console.log(error)

                await updated.populate('user', ['email', 'firstName', 'lastName']).execPopulate()
                await updated.populate('project', 'name').execPopulate()
    
                res.status(200).json({
                    message: "Timer stopped",
                    active: false,
                    data: updated
                })
            })

        } else {
            const newObject = new schema({
                project: project,
                user: user,
                dateStart: Date.now()
            })

            newObject.save(async (error, created) => {
                if (error) console.log(error)

                await created.populate('user', ['email', 'firstName', 'lastName']).execPopulate()
                await created.populate('project', 'name').execPopulate()

                res.status(200).json({
                    message: "Timer started",
                    active: true,
                    data: created
                })
            })
        }
    } catch (error) {
        errorHandler(error, res)
    }
}

exports.getTimerByProject = async (req, res) => {
    try {
        const project = req.params.id
        const exist = await projectService.exists(project)
        if (!exist) throw new ApplicationError("The project provided does not exist")

        const filter = {
            project: project
        }

        Model.find(filter)
        .populate('user', ['email', 'firstName', 'lastName'])
        .populate('project', 'name')
        .exec((error, result) => {
            if (error) console.log(error)
            res.status(200).json(result)
        })

    } catch (error) {
        errorHandler(error, res)
    }
}

exports.getTimerByUser = async (req, res) => {
    try {
        const user = req.params.id
        const exist = await userService.exists(user)
        if (!exist) throw new ApplicationError("The user provided does not exist")

        const filter = {
            user: user
        }

        Model.find(filter)
        .populate('user', ['email', 'firstName', 'lastName'])
        .populate('project', 'name')
        .exec((error, result) => {
            if (error) console.log(error)
            res.status(200).json(result)
        })

    } catch (error) {
        errorHandler(error, res)
    }
}

exports.deleteTimer = async (req, res) => {
    try {
        const timer = req.params.id
        const exist = await timerService.exists(timer)
        if (!exist) throw new ApplicationError("The timer provided does not exist")

        const filter= {
            _id: req.params.id
        }

        Model.remove(filter, (error) => {
            res.status(200).json({"message": "timer successfully removed"})
            if (error) console.log(error)
        })

    } catch (error) {
        errorHandler(error, res)
    }
}
