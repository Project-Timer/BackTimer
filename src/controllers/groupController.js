const mongoose = require('mongoose');
const GroupModel = require('../models/groupModel');
const groupmodel = mongoose.model("Group");
const userService = require('../services/users.services')
const groupService = require('../services/groups.services')

exports.createGroup = function (req, res) {
    let name = req.body.name.trim();
    // TODO: le cas ou il ajoute ladmin dans la list  JOI
    // TOTO: comment faire dans le cas ou il y a des faux ID
    groupService.getUserList(req).then(function (response) {
        const initGroup = new GroupModel({
            name: name,
            user: response,
        });
        initGroup.save((error, result) => {
            if (error) res.status(500).json({error: "Erreur serveur."});
            if (result) return res.json({message: 'Thank you for creating your group'})
        });
    }).catch(function (error) {
        console.log(error)
    })
};


exports.deleteGroup = (req, res) => {
    GroupModel.remove({"_id": req.params.group_id}, (error) => {
        if (error) {
            res.status(500);
            console.log(error);
            res.json({message: "Server Error."})
        } else {
            res.status(200);
            res.json({"message": "Group successfully removed"});
        }
    })
};


exports.getGroupById = (req, res) => {
    GroupModel.findById({"_id": req.params.group_id}, (error, group) => {
        if (error) {
            res.status(500);
            console.log(error);
            res.json({message: "Error server"})
        } else {
            res.status(200);
            res.json(group);
        }
    })
};

exports.getGroupsList = (req, res) => {
    groupmodel.find({}, (error, groupmodel) => {
        if (error) {
            res.status(500);
            console.log(error);
            res.json({message: "Server Error."})
        } else {
            res.status(200);
            res.json(groupmodel);
        }
    });
};

exports.updateGroup = async (req, res) => {
    groupmodel.find(
        {
            name: req.body.name,
            user: [{
                'user_id': req.params.user_id,
                'role': 'admin'
            }]
        }, (error, result) => {
            if (error) {
                res.status(400);
                res.json({message: "Your are not admin"})
            } else if (result) {
                const insert = {
                    name: req.body.name,
                    user: req.body.user
                }
                groupmodel.findOneAndUpdate({_id: req.params.group_id}, insert, {new: true}, (error, group) => {
                    if (error) {
                        res.status(500);
                        console.log(error);
                        res.json({message: "Server error"});
                    }
                    if (group) {
                        res.status(200).json(group)
                    }
                });
            } else {
                res.status(500);
            }
        });
};


exports.getGroups = async (id_group) => {
    return new Promise((resolve, reject) => {
        groupmodel.findById(id_group, (errors, result) => {
                if (result){
                    resolve(result)
                } else {
                    reject()
                }
            })
    })
}
//voir avec adrien
exports.getGroupAdmin = async (user_id) => {
    return new Promise((resolve, reject) => {
        groupmodel.find({
            user: {
                $elemMatch:
                    {
                        role: 'admin',
                        user_id: user_id
                    }
            }
        },(errors, result) => {
            if (result) {
                resolve(result)
            } else {
                reject()
            }
        })
    })
}