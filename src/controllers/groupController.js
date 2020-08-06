const mongoose = require('mongoose');
const GroupModel = require('../models/groupModel');
const groupmodel = mongoose.model("Group");
const userController = require('../controllers/userController')

exports.createGroup = function (req, res) {
    let name = req.body.name.trim();
    // TODO: le cas ou il ajoute ladmin dans la list
    // TOTO: comment faire dans le cas ou il y a des faux ID
    let promiseUser = function (user) {
        return new Promise((resolve, reject) => {
            userController.get_user_info(user).then(function (response) {
                resolve(response)
            }).catch((err) => {
                console.log(err)
                reject(err)
            })
        })
    }
    let promiseuserdeux = function () {
        return new Promise((resolve, reject) => {
            let listuser = []
            let data = {}
            let listUser = req.body.user;
            listUser.push({"user_id": req.user._id})
            listUser.forEach((val, key) => {
                promiseUser(val.user_id).then(function (response) {
                    data = {
                        user_id: response._id,
                        lastname: response.lastname,
                        name: response.name,
                        email: response.email,
                    }
                    if (response._id.toString() === req.user._id) {
                        data.role = "admin"
                    }
                    listuser.push(data)
                    if (req.body.user.length - 1 === key) {
                        resolve(listuser)
                    }
                }).catch((err) => {
                    console.log(err)
                    reject()
                })
            })
        })
    }
    promiseuserdeux().then(function (response) {
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

exports.getGroups = (req, res) => {
    groupmodel.find(
        {
            $or: [
                {'_id_admin': req.params.user_id},
                {'user.user_id': req.params.user_id}
            ]
        }, (error, groupmodel) => {
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
                    user : req.body.user
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

exports.is_AdminGroup = async (id_group, id_user) => {
    return new Promise((resolve, reject) => {
        groupmodel.find({
            _id: id_group,
            user: {
                $elemMatch:
                    {
                        user_id: id_user,
                        role: 'admin'
                    }
            }
        }, (errors, result) => {
            if (result) {
                resolve(result)
            } else {
                reject()
            }
        })
    })
}