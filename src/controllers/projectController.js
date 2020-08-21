const mongoose = require('mongoose')
const Schema = require('../models/projectModel')
const Model = mongoose.model("Project")
const groupServices = require('../services/groups.services')
const projectServices = require('../services/project.services')
const userServices = require('../services/users.services')
const ApplicationError = require("../errors/application.errors")
const {errorHandler} = require('../utils/errorsHandler')
const {isValid} = require('../utils/validationParams')

exports.createProject = async (req, res) => {
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
            throw new ApplicationError("This project already exist. Please choose a different name")
        } else {
            const groups = await groupServices.getGroupList(req.body.groups)
            const user = await userServices.getUser(req.user._id)

            const newObject = new Schema({
                name: name,
                groups: groups,
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

        if (isAdmin) {
            const filter = {
                _id: project
            }
    
            Model.remove(filter, (error) => {
                if (error) console.log(error)
                res.status(200).json({message: "project successfully removed"})
            })
        } else {
            throw new ApplicationError("You must be an administrator of this group to perform this operation")
        }
    }catch (error) {
        errorHandler(error, res)
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = req.params.id

        if (isValid(project)) {
            const filter = {
                _id: project
            }

            const result = await Model.findById(filter, (error, result) => {
                if (error) console.log(error)
                return result
            })

            if (result) {
                res.status(200).json(result)
            } else {
                throw new ApplicationError("The project does not exist", 500)
            }
        } else {
            throw new ApplicationError("The project id is not valid", 500)
        }
    } catch (error) {
        errorHandler(error, res)
    }
};

exports.getAllProjects = async (req, res) => {
    try{
        Model.find({}, (error, result) => {
            if (error) console.log(error)
            res.status(200).json(result)
        })
    }catch(error){
        errorHandler(error, res)
    }
};

exports.updateProject = async (req, res) => {
    try {
        const project = req.params.id
        const admin = (req.body.admin) ? req.body.admin : req.user._id
        const isAdmin = await projectServices.isAdmin(project, admin)

        if (isAdmin) {
            const groups = await groupServices.getGroupList(req.body.groups)
            const newAdmin = await userServices.getUser(admin)

            const update = {
                name: req.body.name,
                groups: groups,
                admin: [{
                    user_id: newAdmin._id,
                    lastname: newAdmin.lastname,
                    name: newAdmin.name,
                    email: newAdmin.email
                }]
            };

            const filter = {
                _id: project
            }
        
            Model.findOneAndUpdate(filter, update,{new: true}, (error, updated) => {
                if (error) console.log(error)
                res.status(200).json(updated)
            })
        } else {
            throw new ApplicationError("You must be an administrator of this group to perform this operation")
        }
    } catch (error) {
        errorHandler(error, res)
    }
}