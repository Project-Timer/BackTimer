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
exports.createGroup2 = async function (req, res) {
    let filter = {"_id": {"$in": ['5f3bd1be9b1ac7002b47823b', '5f3bf23124e0c70092510e4d']}}

    UserModel.find(filter, function (error, result) {
        if (error) console.log(error)
    })

    Model.find({"users_id": {"$in": ['5f3bd1be9b1ac7002b47823b', '5f3bf23124e0c70092510e4d']}}, function (error, result) {
        if (error) console.log(error)
        return res.status(200).json(result)
    });
    console.log('-----')
    console.log(await userService.listExist(['5f3bd1be9b1ac7002b47823b', '5f3bf23124e0c70092510e4d']))
}

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
                result.admin = await groupService.getMember(result.admin)
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

exports.getGroupsList = async (req, res) => {
    try {
        let group = await Model.find({}, null, {lean: true}, (error, result) => {
            if (error) console.log(error)
            return result
        });
        for (let i = 0; i < group.length; i++) {
            group[i].users = await groupService.getUserList(group[i].users)
            group[i].admin = await groupService.getMember(group[i].admin)
        }
        res.status(200).json(group);
    } catch (error) {
        errorHandler(error, res)
    }
};

exports.updateGroup = async (req, res) => {
    try {
        const group = req.params.group_id
        const admin = req.user._id
        const isAdmin = await groupService.isAdmin(group, admin)
        if (isAdmin) {
            const filter = {
                _id: group
            }
            const update = {
                name: req.body.name,
                users: req.body.users
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
                users: {
                    $in: [
                        user
                    ]
                }
            }
            let result = await Model.find(filter,null, {lean: true}, (error, result) => {
                if (error) console.log(error)
                return result
            });
            if(result){
                for (let i = 0; i < result.length; i++) {
                    result[i].users = await groupService.getUserList(result[i].users)
                    result[i].admin = await groupService.getMember(result[i].admin)
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
