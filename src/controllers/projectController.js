const mongoose = require('mongoose')
const Schema = require('../models/projectModel')
const Model = mongoose.model("Project")
const groupServices = require('../services/groups.services')
const projectServices = require('../services/projects.services')
const ApplicationError = require("../errors/application.errors")
const {errorHandler} = require('../utils/errorsHandler')

exports.createProject = async (req, res) => {
    try {
        const name = req.body.name
        const used = await Model.exists({name: name})
        if (used) throw new ApplicationError("This name is already used")

        const groups = req.body.groups
        await groupServices.listExist(groups)

        const newObject = new Schema({
            name: name,
            groups: groups,
            admin: req.user._id
        });

        newObject.save(async (error, created) => {
            if (error) console.log(error)
            await created.populate('groups', 'name').execPopulate()
            await created.populate('admin', ['email', 'firstName', 'lastName']).execPopulate()
            return res.status(200).json(created)
        });

    } catch (error) {
        errorHandler(error, res)
    }
};

exports.getAllProjects = async (req, res) => {
    try {
        await Model.find({})
        .populate('groups', 'name')
        .populate('admin', ['email', 'firstName', 'lastName'])
        .exec((error, result) => {
            if (error) console.log(error)
            res.status(200).json(result);
        })
    } catch (error) {
        errorHandler(error, res)
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = req.params.id
        const exist = await projectServices.exists(project)
        if (!exist) throw new ApplicationError("The project provided does not exist")

        const filter = {
            _id: project
        }

        const result = await Model.findById(filter)
        .populate('groups', 'name')
        .populate('admin', ['email', 'firstName', 'lastName'])
        .exec((error, result) => {
            if (error) console.log(error)
            res.status(200).json(result)
        })

    } catch (error) {
        errorHandler(error, res)
    }
};

exports.updateProject = async (req, res) => {
    try {
        const project = req.params.id
        const user = req.user._id
        const isAdmin = await projectServices.isAdmin(project, user)
        if (!isAdmin) throw new ApplicationError("You must be an administrator of this project to perform this operation")

        const groups = req.body.groups
        await groupServices.listExist(groups)

        const update = {
            name: req.body.name,
            groups: groups
        };

        const filter = {
            _id: project
        }

        Model.findOneAndUpdate(filter, update, {new: true}, async (error, updated) => {
            if (error) console.log(error)
            await updated.populate('groups', 'name').execPopulate()
            await updated.populate('admin', ['email', 'firstName', 'lastName']).execPopulate()
            res.status(200).json(updated)
        })

    } catch (error) {
        errorHandler(error, res)
    }
}

exports.deleteProject = async (req, res) => {
    try {
        const project = req.params.id
        const user = req.user._id
        const isAdmin = await projectServices.isAdmin(project, user)
        if (!isAdmin) throw new ApplicationError("You must be an administrator of this project to perform this operation")

        const filter = {
            _id: project
        }

        Model.remove(filter, (error) => {
            if (error) console.log(error)
            res.status(200).json({message: "project successfully removed"})
        })

    } catch (error) {
        errorHandler(error, res)
    }
};