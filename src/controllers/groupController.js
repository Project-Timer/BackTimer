const mongoose = require('mongoose');
const Schema = require('../models/groupModel');
const Model = mongoose.model("Group");
const groupService = require('../services/groups.services')
const userService = require('../services/users.services')
const ApplicationError = require('../errors/application.errors')
const {errorHandler} = require('../utils/errorsHandler')
const {isValid} = require('../utils/validationParams')

exports.createGroup = async function (req, res) {
    try {
        const name = req.body.name.trim();

        const filter = {
            name: name
        }

        const exist = await Model.findOne(filter, (error, result) => {
            if (error) console.log(error)
            return result
        })

        if (exist) {
            throw new ApplicationError("This group already exist. Please choose a different name")
        } else {
            const list = await userService.getUserList(req)

            const newObject = new Schema({
                name: name,
                users: list,
            });

            newObject.save((error, created) => {
                if (error) console.log(error)
                return res.status(200).json(created)
            });
        }
    } catch (error) {
        errorHandler(error, res)
    }
};

exports.deleteGroup = async (req, res) => {
    try {
        const group = req.params.group_id
        const user = req.user._id
        const isAdmin = await groupService.isAdmin(group, user)

        if (isAdmin) {
            const filter = {
                _id: group
            }

            Model.remove(filter , (error) => {
                if (error) console.log(error)
                res.status(200).json({message: "Group successfully removed"});
            })
        } else {
            throw new ApplicationError("You must be an administrator of this group to perform this operation")
        }
    } catch (error) {
        errorHandler(error, res)
    }
};

exports.getGroupById = async (req, res) => {
    try {
        const group = req.params.group_id

        if (isValid(group)) {
            const filter = {
                _id: group
            }

            const result = await Model.findById(filter, (error, result) => {
                if (error) console.log(error)
                return result
            })

            if (result) {
                res.status(200).json(result);
            } else {
                throw new ApplicationError("The group does not exist", 500)
            }
        } else {
            throw new ApplicationError("The project id is not valid", 500)
        }
    } catch (error) {
        errorHandler(error, res)
    }
};

exports.getGroupsList = async (req, res) => {
    try {
        Model.find({}, (error, result) => {
            if (error) console.log(error)
            res.status(200).json(result);
        });
    } catch (error) {
        errorHandler(error, res)
    }
};

exports.updateGroup = async (req, res) => {
    try {
        const group = req.params.group_id
        const user = req.user._id
        const isAdmin = await groupService.isAdmin(group, user)

        if (isAdmin) {
            const filter = {
                _id: group
            }

            const users = await userService.getUserList(req)

            const update = {
                    name: req.body.name,
                    users: users
            }

            Model.findOneAndUpdate(filter, update, {new: true}, (error, updated) => {
                if (error) console.log(error)
                res.status(200).json(updated)
            });

        } else {
            throw new ApplicationError("You must be an administrator of this group to perform this operation")
        }
    } catch (error) {
        errorHandler(error, res)
    }

};

exports.getGroupsByUser = async (req, res) => {
    try {
        const user = req.params.user_id
        const exist = await userService.getUser(user)

        if (exist) {

            const filter = {
                $or: [
                    {
                        'user.user_id': user
                    }
                ]
            }

            Model.find(filter, (error, result) => {
                if (error) console.log(error)
                res.status(200).json(result);
            });

        } else {
            throw new ApplicationError("This user does not exist")
        }
    } catch (error) {
        errorHandler(error, res)
    }
};
