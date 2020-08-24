const mongoose = require('mongoose')
const Schema = require('../models/groupModel')
const Model = mongoose.model("Group")
const groupService = require('../services/groups.services')
const userService = require('../services/users.services')
const {errorHandler} = require('../utils/errorsHandler')

exports.createGroup = async (req, res) => {
    try {
        await groupService.checkData(req)

        const newObject = new Schema({
            name: req.body.name.trim(),
            users: req.body.users,
            admin: req.user._id
        })

        newObject.save(async (error, created) => {
            if (error) console.log(error)
            await created.populate('users', ['email', 'firstName', 'lastName']).execPopulate()
            await created.populate('admin', ['email', 'firstName', 'lastName']).execPopulate()
            return res.status(200).json(created)
        })

    } catch (error) {
        errorHandler(error, res)
    }
}

exports.getAllGroups = async (req, res) => {
    try {
        await Model.find({})
        .populate('users', ['email', 'firstName', 'lastName'])
        .populate('admin', ['email', 'firstName', 'lastName'])
        .exec((error, result) => {
            if (error) console.log(error)
            res.status(200).json(result)
        })
    } catch (error) {
        errorHandler(error, res)
    }
}

exports.getGroupById = async (req, res) => {
    try {
        const group = req.params.id
        await groupService.checkId(group)

        const filter = {
            _id: group
        }

        await Model.findById(filter)
        .populate('users', ['email', 'firstName', 'lastName'])
        .populate('admin', ['email', 'firstName', 'lastName'])
        .exec((error, result) => {
            if (error) console.log(error)
            res.status(200).json(result)
        })

    } catch (error) {
        errorHandler(error, res)
    }
}

exports.getGroupsByUser = async (req, res) => {
    try {
        const user = req.params.id
        await userService.checkId(user)

        const filter = {
            users: {
                $in: [
                    user
                ]
            }
        }

        await Model.find(filter)
        .populate('users', ['email', 'firstName', 'lastName'])
        .populate('admin', ['email', 'firstName', 'lastName'])
        .exec((error, result) => {
            if (error) console.log(error)
            res.status(200).json(result)
        })

    } catch (error) {
        errorHandler(error, res)
    }
}

exports.updateGroup = async (req, res) => {
    try {        
        await groupService.checkData(req)

        const filter = {
            _id: req.params.id
        }

        const update = {
            name: req.body.name,
            users: req.body.users,
            admin: req.body.admin
        }

        Model.findOneAndUpdate(filter, update, {new: true,}, async (error, updated) => {
            if (error) console.log(error)
            await updated.populate('users', ['email', 'firstName', 'lastName']).execPopulate()
            await updated.populate('admin', ['email', 'firstName', 'lastName']).execPopulate()
            return res.status(200).json(updated)
        })

    } catch (error) {
        errorHandler(error, res)
    }
}

exports.deleteGroup = async (req, res) => {
    try {
        const group = req.params.id
        const user = req.user._id
        await groupService.checkIfAdmin(group, user)

        const filter = {
            _id: group
        }

        Model.remove(filter, (error) => {
            if (error) console.log(error)
            res.status(200).json({message: "Group successfully removed"})
        })

    } catch (error) {
        errorHandler(error, res)
    }
}