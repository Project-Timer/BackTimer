const mongoose = require('mongoose');
const Schema = require('../models/groupModel');
const Model = mongoose.model("Group");
const groupService = require('../services/groups.services')
const userService = require('../services/users.services')
const ApplicationError = require('../errors/application.errors')
const {errorHandler} = require('../utils/errorsHandler')

exports.createGroup = async (req, res) => {
    try {
        const name = req.body.name
        const used = await Model.exists({name: name})
        if (used) throw new ApplicationError("This name is already used")

        const users = req.body.users;
        const exist = await userService.listExist(users)
        if (!exist) throw new ApplicationError("One or several users in the list provided do not exist")

        const newObject = new Schema({
            name: name,
            users: users,
            admin: req.user._id
        });

        newObject.save(async (error, created) => {
            if (error) console.log(error)
            await created.populate('users', ['email', 'firstName', 'lastName']).execPopulate()
            await created.populate('admin', ['email', 'firstName', 'lastName']).execPopulate()
            return res.status(200).json(created)
        });

    } catch (error) {
        errorHandler(error, res)
    }
};

exports.getAllGroups = async (req, res) => {
    try {
        await Model.find({})
        .populate('users', ['email', 'firstName', 'lastName'])
        .populate('admin', ['email', 'firstName', 'lastName'])
        .exec((error, result) => {
            if (error) console.log(error)
            res.status(200).json(result);
        })
    } catch (error) {
        errorHandler(error, res)
    }
};

exports.getGroupById = async (req, res) => {
    try {
        const group = req.params.id
        const exist = await groupService.exists(group)
        if (!exist) throw new ApplicationError("The group provided does not exist")

        const filter = {
            _id: group
        }

        await Model.findById(filter)
        .populate('users', ['email', 'firstName', 'lastName'])
        .populate('admin', ['email', 'firstName', 'lastName'])
        .exec((error, result) => {
            if (error) console.log(error)
            res.status(200).json(result);
        })

    } catch (error) {
        errorHandler(error, res)
    }
};

exports.getGroupsByUser = async (req, res) => {
    try {
        const user = req.params.id
        const exist = await userService.exists(user)
        if (!exist) throw new ApplicationError("The user provided does not exist")

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
            res.status(200).json(result);
        })

    } catch (error) {
        errorHandler(error, res)
    }
};

exports.updateGroup = async (req, res) => {
    try {        
        const group = req.params.id
        const user = req.user._id
        const isAdmin = await groupService.isAdmin(group, user)
        if (!isAdmin) throw new ApplicationError("You must be an administrator of this group to perform this operation")

        const name = req.body.name
        const used = await Model.exists({_id: {$nin: group}, name: name})
        if (used) throw new ApplicationError("This name is already used")

        const users = req.body.users;
        const exist = await userService.listExist(users)
        if (!exist) throw new ApplicationError("One or several users in the list provided do not exist")

        const filter = {
            _id: group
        }

        const update = {
            name: name,
            users: users
        }

        Model.findOneAndUpdate(filter, update, {new: true,}, async (error, updated) => {
            if (error) console.log(error)
            await updated.populate('users', ['email', 'firstName', 'lastName']).execPopulate()
            await updated.populate('admin', ['email', 'firstName', 'lastName']).execPopulate()
            return res.status(200).json(updated)
        });

    } catch (error) {
        errorHandler(error, res)
    }
};

exports.deleteGroup = async (req, res) => {
    try {
        const group = req.params.id
        const user = req.user._id
        const isAdmin = await groupService.isAdmin(group, user)
        if (!isAdmin) throw new ApplicationError("You must be an administrator of this group to perform this operation")

        const filter = {
            _id: group
        }

        Model.remove(filter, (error) => {
            if (error) console.log(error)
            res.status(200).json({message: "Group successfully removed"});
        })

    } catch (error) {
        errorHandler(error, res)
    }
};