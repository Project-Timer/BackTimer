const mongoose = require('mongoose');
const GroupModel = require('../models/groupModel');
const groupmodel = mongoose.model("Group");
const userController = require('../controllers/userController')

exports.createGroup = function (req, res) {
    let name = req.body.name.trim();
    let promiseUser = function (user) {
        return new Promise((resolve, reject) => {
            userController.get_user_info(user).then(function (response) {
                console.log('RESPONSE_____________'+response)
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
            req.body.user.forEach((user) => {
                promiseUser(user.user_id).then(function (response) {
                    let data = {
                        user_id: user.user_id,
                        lastname: response.lastname,
                        name: response.name,
                        email: response.email,
                    }
                    listuser.push(data)

                }).catch((err) => {
                    console.log(err)
                    reject()
                })
            })
        })
    }
    promiseuserdeux().then(function (response) {
        console.log('IN Promise')
        const initGroup = new GroupModel({
            name: name,
            user: response
        });
        initGroup.save((error, result) => {
            if (error) res.status(500).json({error: "Erreur serveur."});
            GroupModel.findOne({name: name}).then((record) => {
                record.user.push({
                    user_id: req.user._id,
                    role: 'admin'
                });
                record.save((error) => {
                    if (error) return res.status(500).json({error: 'Error Create Group'})
                    return res.json({message: 'Thank you for creating your group'})
                });
            })
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

    const group = {
        name: req.body.name,
        admin: req.body.admin,
        members: req.body.members
    };

    const filter = {
        _id: req.params.group_id
    }

    groupmodel.findOneAndUpdate(filter, group, {new: true}, (error, group) => {
        if (error) {
            res.status(500);
            console.log(error);
            res.json({message: "Server error"});
        } else {
            res.status(200);
            res.json(group);
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