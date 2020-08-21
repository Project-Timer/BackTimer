const mongoose = require('mongoose')
const Schema = require('../models/projectModel')
const Model = mongoose.model("Project")
const groupServices = require('../services/groups.services')
const projectServices = require('../services/projects.services')
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
            const groups = req.body.groups
            const listExist = await groupServices.listExist(groups)
            if (listExist) {
                const newObject = new Schema({
                    name: name,
                    groups: groups,
                    admin: req.user._id
                });
                newObject.save((error, created) => {
                    if (error) console.log(error)
                    return res.status(200).json(created)
                });
            } else {
                throw new ApplicationError("One or several group do not exist")
            }
        }
    } catch (error) {
        errorHandler(error, res)
    }
};
exports.deleteProject = async (req, res) => {
    try {
        const project = req.params.id
        const userAdmin = req.user._id
        const isAdmin = await projectServices.isAdmin(project, userAdmin)

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
    } catch (error) {
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
            const result = await Model.findById(filter, null, {lean: true}, (error, result) => {
                if (error) console.log(error)
                return result
            })
            console.log(result)
            if (result) {
                result.admin = await projectServices.getFormatedUser(result.admin)
                result.groups = await projectServices.getGroupList(result.groups)
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
    try {
        let projects = await Model.find({}, null, {lean: true}, (error, result) => {
            if (error) console.log(error)
            return result
        })
        for (let i = 0; i < projects.length; i++) {
            projects[i].groups = await projectServices.getGroupList(projects[i].groups)
            projects[i].admin = await projectServices.getFormatedUser(projects[i].admin)
        }
        console.log(projects)
        res.status(200).json(projects);
    } catch (error) {
        errorHandler(error, res)
    }
};

exports.updateProject = async (req, res) => {
    try {
        const project = req.params.id
        const groups = req.body.groups
        const admin = (req.body.admin) ? req.body.admin : req.user._id
        const isAdmin = await projectServices.isAdmin(project, admin)
        if (isAdmin) {
            const hasDuplicate = new Set(groups).size !== groups.length

            const listExist = await groupServices.listExist(groups)
            if (listExist && !hasDuplicate) {
                const update = {
                    name: req.body.name,
                    groups: groups,
                    admin: admin
                };

                const filter = {
                    _id: project
                }
                Model.findOneAndUpdate(filter, update, {new: true}, (error, updated) => {
                    if (error) console.log(error)
                    res.status(200).json(updated)
                })
            } else if (hasDuplicate) {
                throw new ApplicationError("There is duplicated values in the group list provided")
            } else {
                throw new ApplicationError("One or several group do not exist")
            }
        } else {
            throw new ApplicationError("You must be an administrator of this group to perform this operation")
        }
    } catch (error) {
        errorHandler(error, res)
    }
}