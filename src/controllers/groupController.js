const mongoose = require('mongoose');
const Schema = require('../models/groupModel');
const Model = mongoose.model("Group");
const UserModel = mongoose.model("User")

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
            const listUsers = req.body.users;
            const ListExist = await userService.listExist(listUsers)
            if (ListExist) {
                const newObject = new Schema({
                    name: name,
                    users: listUsers,
                    admin: req.user._id
                });
                newObject.save((error, created) => {
                    if (error) console.log(error)
                    return res.status(200).json(created)
                });
                // TODO faire le retour des informations
            } else {
                throw new ApplicationError("One or several users do not exist")
            }
        }
    } catch (error) {
        errorHandler(error, res)
    }
};
exports.deleteGroup = async (req, res) => {
    try {
        const group = req.params.group_id
        const admin = req.user._id
        const isAdmin = await groupService.isAdmin(group, admin)

        if (isAdmin) {
            const filter = {
                _id: group
            }
            Model.remove(filter, (error) => {
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

            let result = await Model.findById(filter, null, {lean: true}, (error, result) => {
                if (error) console.log(error)
                return result
            })
            if (result) {
                result.admin = await groupService.getFormatedMember(result.admin)
                result.users = await groupService.getUserList(result.users)
                res.status(200).json(result);
            } else {
                throw new ApplicationError("The group does not exist", 500)
            }
        } else {
            throw new ApplicationError("The group id is not valid", 500)
        }
    } catch (error) {
        errorHandler(error, res)
    }
};

exports.getAllGroups = async (req, res) => {
    try {
        let groups = await Model.find({}, null, {lean: true}, (error, result) => {
            if (error) console.log(error)
            return result
        });
        for (let i = 0; i < groups.length; i++) {
            groups[i].users = await groupService.getUserList(groups[i].users)
            groups[i].admin = await groupService.getFormatedMember(groups[i].admin)
        }
        res.status(200).json(groups);
    } catch (error) {
        errorHandler(error, res)
    }
};

exports.updateGroup = async (req, res) => {
    try {
        const group = req.params.group_id
        const admin = req.user._id
        const groupName = req.body.name
        const isAdmin = await groupService.isAdmin(group, admin)

        const exist = await groupService.groupExist(group, groupName)
        console.log(exist)
        if (isAdmin && !exist) {
            const filter = {
                _id: group
            }
            const update = {
                name: groupName,
                users: req.body.users
            }
            const updated = await Model.findOneAndUpdate(filter, update, {
                new: true,
                lean: true
            }, async (error, updated) => {
                if (error) console.log(error)
                return updated
            });
            updated.admin = await groupService.getFormatedMember(updated.admin)
            updated.users = await groupService.getUserList(updated.users)
            res.status(200).json(updated)
        } else if (exist) {
            throw new ApplicationError("This group already exist. Please choose a different name")
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
                users: {
                    $in: [
                        user
                    ]
                }
            }
            let result = await Model.find(filter, null, {lean: true}, (error, result) => {
                if (error) console.log(error)
                return result
            });
            if (result) {
                for (let i = 0; i < result.length; i++) {
                    result[i].users = await groupService.getUserList(result[i].users)
                    result[i].admin = await groupService.getFormatedMember(result[i].admin)
                }
                res.status(200).json(result);
            }

        } else {
            throw new ApplicationError("This user does not exist")
        }
    } catch (error) {
        errorHandler(error, res)
    }
};
