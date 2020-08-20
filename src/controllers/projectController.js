const mongoose = require('mongoose');
const Schema = require('../models/projectModel');
const Model = mongoose.model("Project");
const groupServices = require('../services/groups.services')
const projectServices = require('../services/project.services')
const userServices = require('../services/users.services')
const ApplicationError = require("../errors/application.errors");

exports.createProject = async (req, res) => {
    await Model.findOne({name: req.body.name}, (error, result) => {
        if (result) {
            res.status(400).json({message: "this project already exist"})
        } else {
            groupServices.createGroupList(req.body.group).then(function (groups) {
                if (groups) {
                    userServices.get_user_info(req.user._id).then((user) => {
                        const newObject = new Schema({
                            name: req.body.name.trim(),
                            group: groups,
                            admin: [{
                                user_id: user._id,
                                lastname: user.lastname,
                                name: user.name,
                                email: user.email
                            }]
                        });
                        newObject.save((error, created) => {
                            if (error) {
                                res.status(500).json({message: 'Error create Project'})
                            } else {
                                res.status(200).json(created)
                            }
                        })
                    })
                }
            }).catch((error) => {
                console.log(error)
                if (error instanceof ApplicationError) {
                    res.status(200).json(error)
                } else {
                    res.status(500).json({message: 'Error server'})
                }
            })
        }
    })
};

exports.deleteProject = (req, res) => {
    projectServices.getGroupAdmin(req.user._id, req.params.id).then(()=>{
        Model.remove({"_id": req.params.id}, (error) => {
            if (error) {
                throw new Error(error)
            } else {
                res.status(200).json({message: "project successfully removed"});
            }
        })
    }).catch((error) => {
        console.log(error)
        if (error instanceof ApplicationError) {
            res.status(200).json(error)
        } else {
            res.status(500).json({message: 'Error server'})
        }
    })
};

exports.getProjectById = (req, res) => {
    try {
        Model.findById({"_id": req.params.id}, (error, result) => {
            if (error) {
                throw new Error(error)
            } else {
                res.status(200).json(result);
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Error server'})
    }
};

exports.getAllProjects = (req, res) => {
    try{
        Model.find({}, (error, result) => {
            if (error) {
                throw new Error(error)
            } else {
                res.status(200).json(result);
            }
        })
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Error server"})
    }
};
exports.updateProject = (req, res) => {
    projectServices.getGroupAdmin(req.user._id, req.params.id).then(()=>{
        const update = {
            name: req.body.name,
            group: req.body.group,
            admin: req.body.admin
        };
        const filter = {
            _id: req.params.id
        }
        Model.findOneAndUpdate(filter, update,{new: true}, (error, updatedResult) => {
            if (error) {
                console.log(error);
                res.status(500).json({message: "Error server"})
            } else {
                res.status(200).json(updatedResult);
            }
        })
    }).catch((error)=>{
        console.log(error)
        if (error instanceof ApplicationError) {
            res.status(200).json(error)
        } else {
            res.status(500).json({message: 'Error server'})
        }
    })
}