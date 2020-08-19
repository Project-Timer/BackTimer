const mongoose = require('mongoose');
const ProjectModel = require('../models/projectModel');
const groupServices = require('../services/groups.services')
const projectServices = require('../services/project.services')
const userServices = require('../services/users.services')
const ApplicationError = require("../errors/application.errors");
const validationParams = require('../utils/validationParams')

exports.createProject = async (req, res) => {
    await ProjectModel.findOne({name: req.body.name}, (error, result) => {
        if (result) {
            res.status(400).json({message: "this project already exist"})
        } else {
            groupServices.createGroupList(req.body.group).then(function (groups) {
                if (groups) {
                    userServices.get_user_info(req.user._id).then((user) => {
                        const initProject = new ProjectModel({
                            name: req.body.name.trim(),
                            group: groups,
                            admin: [{
                                user_id: user._id,
                                lastname: user.lastname,
                                name: user.name,
                                email: user.email
                            }]
                        });
                        // TODO VERIFIY WITH JOI VALIDATION iniProject
                        initProject.save((err) => {
                            if (err) {
                                res.status(500).json({
                                    message: 'Error create Project'
                                })
                            } else {
                                res.status(200).json({message: "Thank you for creating project"})
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

//TODO PB delete  DEMAIN
exports.deleteProject = (req, res) => {
    projectServices.getGroupAdmin(req.user._id, req.params.id).then(
        ProjectModel.remove({"_id": req.params.id}, (error) => {
            if (error) {
                throw new Error(error)
            } else {
                res.status(200);
                res.json({message: "project successfully removed"});
            }
        })
    ).catch((error) => {
        console.log(error)
        if (error instanceof ApplicationError) {
            res.status(200).json(error)
        } else {
            res.status(500).json({message: 'Error server'})
        }
    })

};
exports.getProjectById = (req, res) => {
    ProjectModel.findById({"_id": req.params.project_id}, (error, group) => {
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

exports.getAllProjects = (req, res) => {
    try{
        ProjectModel.find({}, (error, group) => {
            if (error) {
                throw new Error(error)
            } else {
                res.status(200);
                res.json(group);
            }
        })
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Error server"})
    }
};
exports.updateProject = (req, res) => {

    const project = {
        name: req.body.name,
    };
    const filter = {
        _id: req.params.project_id
    }
    ProjectModel.findOneAndUpdate(filter, project, (error, group) => {
        if (error) {
            res.status(500);
            console.log(error);
            res.json({message: "Error server"})
        } else {
            res.status(200);
            res.json(group);
        }
    })
}