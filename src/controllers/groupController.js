const mongoose = require('mongoose');
const GroupModel = require('../models/groupModel');
const groupmodel = mongoose.model("Group");
const groupService = require('../services/groups.services')
const userService = require('../services/users.services')
const ApplicationError = require('../errors/application.errors')
const validationParams = require('../utils/validationParams')
exports.createGroup = function (req, res) {
    try {
        let name = req.body.name.trim();
        // TODO: le cas ou il ajoute ladmin dans la list  JOI
        userService.createUserList(req).then(function (response) {
            const initGroup = new GroupModel({
                name: name,
                user: response,
            });
            initGroup.save((error, result) => {
                if (error) {
                    throw new Error(error)
                }
                if (result) return res.json({message: 'Thank you for creating your group'})
            });
        }).catch(function (error) {
            if (error instanceof ApplicationError) {
                res.status(200).json(error)
            }
            throw new Error(error)
        })
    } catch (error) {
        console.log(error)
        if (error instanceof ApplicationError) {
            res.status(200).json(error)
        } else {
            res.status(500).json({message: 'Error server'})
        }
    }

};

exports.deleteGroup = async (req, res) => {
    try {
        let is_admin = await groupmodel.findOne({
            _id: req.params.group_id,
            user: {
                $elemMatch:
                    {
                        user_id: req.user._id,
                        role: 'admin'
                    }
            }
        }, (errors, result) => {
            return result != null;
        })
        if (is_admin) {
            GroupModel.remove({"_id": req.params.group_id}, (error) => {
                if (error) {
                    throw new Error(error)
                } else {
                    res.status(200);
                    res.json({"message": "Group successfully removed"});
                }
            })
        } else {
            throw new ApplicationError("You are not admin of this group")
        }
    } catch (error) {
        console.log(error)
        if (error instanceof ApplicationError) {
            res.status(200).json(error)
        } else {
            res.status(500).json({message: 'Error server'})
        }
    }

};

exports.getGroupById = (req, res) => {
    validationParams.ifValidId(req.params.user_id).then(() => {
        GroupModel.findById({"_id": req.params.group_id}, (error, group) => {
            if (error) {
                throw new Error(error)
            } else {
                res.status(200);
                res.json(group);
            }
        })
    }).catch((error) => {
        console.log(error)
        res.status(500).json({message: 'Argument passed in must be a valid group id'})
    })
};

exports.getGroupsList = (req, res) => {
    try {
        groupmodel.find({}, (error, groupmodel) => {
            if (error) {
                throw new Error(error)
            } else {
                res.status(200);
                res.json(groupmodel);
            }
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Error server'})
    }
};

exports.updateGroup = async (req, res) => {
    await groupService.getGroupAdmin(req.user._id, req.params.group_id).then(() => {
            const insert = {
                name: req.body.name,
                user: req.body.user
            }
            groupmodel.findOneAndUpdate({_id: req.params.group_id}, insert, {new: true}, (error, group) => {
                if (error) {
                    throw new Error(error)
                }
                if (group) {
                    res.status(200).json(group)
                }
            });
        }
    ).catch(() => {
        res.status(403).json({message: 'You are not admin of this group'})
    })
};


exports.getGroupsByUser = (req, res) => {
    validationParams.ifValidId(req.params.user_id).then(() => {
        groupmodel.find({
            $or: [
                {
                    'user.user_id': req.params.user_id,
                }
            ]
        }, (error, groupModel) => {
            if (error) {
                throw new Error(error)
            } else {
                res.status(200);
                res.json(groupModel);
            }
        });
    }).catch((error) => {
        console.log(error)
        res.status(500).json({message: 'Argument passed in must be a valid group id'})
    })
};
