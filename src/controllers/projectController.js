const mongoose = require('mongoose');
const Schema = require('../models/projectModel');
const Model = mongoose.model("Project");
const groupServices = require('../services/groups.services')
const projectServices = require('../services/project.services')
const userServices = require('../services/users.services')
const ApplicationError = require("../errors/application.errors");
const {errorHandler} = require('../utils/errorsHandler')

exports.createProject = async (req, res) => {
    try {
        const name = req.body.name.trim();
        const user = await userServices.getUser(req.user._id)

        const filter = {
            name: name
        }

        const exist = await Model.findOne(filter, (error, result) => {
            if (error) console.log(error)
            return result
        })

        if (exist) {
            throw new ApplicationError("This project already exist. Please choose a different name")
        } else {
            const list = await groupServices.getGroupList(req.body.groups)

            const newObject = new Schema({
                name: name,
                groups: list,
                admin: [{
                    user_id: user._id,
                    lastname: user.lastname,
                    name: user.name,
                    email: user.email
                }]
            });

            newObject.save((error, created) => {
                if (error) console.log(error)
                return res.status(200).json(created)
            });
        }
    } catch (error) {
        errorHandler(error, res)
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const project = req.params.id
        const user = req.user._id
        const isAdmin = await projectServices.isAdmin(project, user)

        if (true) {
            const filter = {
                _id: project
            }
    
            Model.remove(filter, (error) => {
                if (error) console.log(error)
                res.status(200).json({message: "project successfully removed"});
            })
        } else {
            throw new ApplicationError("You must be an administrator of this group to perform this operation")
        }
    }catch (error) {
        errorHandler(error, res)
    }
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
            groups: req.body.group,
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