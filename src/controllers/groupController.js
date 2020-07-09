const mongoose = require('mongoose');
const GroupModel = require('../models/groupModel');
const groupmodel = mongoose.model("Group");
//const {groupValidation} = require('../utils/validation');

exports.createGroup = async (req, res) => {
    //const {error} = groupValidation(req.body);
    //console.log(error)
    //if (error) return res.status(400).json({error: error.message});
    const initGroup = new GroupModel({
        name: req.body.name,
        admin: {
            user_id: req.user,
        },
        user: {
            user_id: req.body.user.user_id,
            role:"user"
        },
    });
    initGroup.save((error, docsInserted) => {
        if (error) {
            res.status(500);
            console.log("result=" + error);
            res.json({message: "Erreur serveur."});
        }
        console.log(docsInserted);
    });
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
            $or: [{members: req.params.user_id},
                {admin: req.params.user_id}]
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
    const {error} = groupValidation(req.body);
    if (error) return res.status(400).json({message: req.body});

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
