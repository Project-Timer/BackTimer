const mongoose = require('mongoose');
const GroupModel = require('../models/groupModel');
const groupmodel = mongoose.model("Group");
const {groupValidation} = require('../utils/validation.js');

exports.createGroup = async (req, res) => {
    const {error} = groupValidation(req.body);
    if(error) return res.status(400).json({error: error.message});

    const group = new GroupModel({
        name: req.body.name,
        admin: req.body.admin,
        members:req.body.members,
    });

    group.save((error)=> {
        if (error) {
            res.status(500);
            console.log("result=" + error);
            res.json({message: "Erreur serveur."});
        }
        res.json({message: "The group has been successfully created"});
    })
};

exports.getGroupById = (req, res) => {
    console.log('ceci est l\'id du groupe : ' + req.params.group_id);
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

exports.getGroupsByUser = (req, res) => {
    groupmodel.find({members: req.params.user_id}, (error, groupmodel) => {
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

    const group = new GroupModel({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });

    group.findOneAndUpdate({_id: req.params.group_id}, group, {new: true}, (error, group) => {
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
