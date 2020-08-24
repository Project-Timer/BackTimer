const mongoose = require('mongoose')
const Schema = require('../models/projectModel')
const Model = mongoose.model("Project")
const projectServices = require('../services/projects.services')
const {errorHandler} = require('../utils/errorsHandler')

exports.createProject = async (req, res) => {
    try {
        await projectServices.checkData(req)

        const newObject = new Schema({
            name: req.body.name,
            groups: req.body.groups,
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
        await projectServices.checkId(project)

        const filter = {
            _id: project
        }

        await Model.findById(filter)
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
        await projectServices.checkData(req)

        const update = {
            name: req.body.name,
            groups: req.body.groups,
            admin: req.body.admin
        };

        const filter = {
            _id: req.params.id
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
        await projectServices.checkIfAdmin(project, user)

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