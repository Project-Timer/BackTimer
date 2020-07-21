const mongoose = require('mongoose');
const ProjectModel = require('../models/projectModel');
const GroupModel = require('../models/groupModel');
const projectmodel = mongoose.model("Project");

exports.createProject = async (req, res) => {
    let name = req.body.name.trim();

    await ProjectModel.findOne({name: req.body.name}, (error, result) => {
        if (result) {
            console.log("Success ----ProjectModel.findOne------------this project was already exist------------------")
            res.status(400).json({message: "this project was already exist"})
        }
        if (error) {
            console.log("ERROR ----ProjectModel.findOne-----------------------------")
            res.status(500).send({error: error})
        }
    })
    console.log("erreur ----------------------------------")
    GroupModel.findOne({
        _id: req.body.group[0].group_id,
        user: {
            $elemMatch:
                {
                    user_id: req.user._id,
                    role: 'admin',
                }
        }
    },(result, error) => {
        if (error) {
            console.log("erreur - GroupModel.findOne --------ERROR---------")
            return res.status(400).json({error: 'error server'})
        }
        if (Object.entries(result).length === 0) {
            console.log("Success - GroupModel.findOne -------- you are admin---------")
            return res.status(400).json({error: 'your are not admin of this group'})
        }
    });

    const initProject = new ProjectModel({
        name: name,
        group: req.body.group
    });
    initProject.save((errors) => {
        if (errors) {
            console.log("erreur - initProject.save -------- errors---------")
            res.status(500).json({
                message: 'Error create Project'
            })
        }
        console.log("Succes- initProject.save --------Thank you for creating project---------")
        res.json({message: "Thank you for creating project"})
    })
};

exports.deleteproject = (req, res) => {
    ProjectModel.remove({"_id": req.params.project_id}, (error) => {
        if (error) {
            res.status(500);
            console.log(error);
            res.json({message: "Server Error."})
        } else {
            res.status(200);
            res.json({message: "project successfully removed"});
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
exports.getProject = (req, res) => {
    ProjectModel.find({}, (error, group) => {
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
exports.updateProject = (req, res) => {
    ProjectModel.findOneAndUpdate({'_id': req.params.project_id}, (error, group) => {
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