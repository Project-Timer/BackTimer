const mongoose = require('mongoose');
const ProjectModel = require('../models/projectModel');
const projectmodel = mongoose.model("Project");

exports.createProject = async (req, res) => {
    //verifier les donnees NAME
    let name = req.body.name.trim();
    const initProject = new ProjectModel({
        name: name,
        group: req.body.group
    });

    init.save((error, result) => {
        if (error) res.status(500).json({error: "Erreur serveur."});

        initProject.findOne({name: name}).then((record) => {
            //dans le cas ou il y a deja un poroject a ce nom
        })
    });
};

exports.deleteproject = (req, res) => {
    ProjectModel.remove({"_id": req.params.project_id}, (error) => {
        if (error) {
            res.status(500);
            console.log(error);
            res.json({message: "Server Error."})
        } else {
            res.status(200);
            res.json({"message": "project successfully removed"});
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
    ProjectModel.findOneAndUpdate({'_id': req.params.project_id}, (errors, group) => {
        if (errors) {
            res.status(500);
            console.log(errors);
            res.json({message: "Error server"})
        } else {
            res.status(200);
            res.json(group);
        }
    })
}