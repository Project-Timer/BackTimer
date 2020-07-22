const mongoose = require('mongoose');
const ProjectModel = require('../models/projectModel');
const projectmodel = mongoose.model("Project");
const groupController = require('../controllers/groupController')
exports.createProject = async (req, res) => {
    let name = req.body.name.trim();
    await ProjectModel.findOne({name: req.body.name}, (error, result) => {
        if (result) {
            res.status(400).json({message: "this project was already exist"})
        } else {
            groupController.testrequest("TestFauxParams","TestFauxParams");
            //let is_admin = groupController.is_AdminGroup(req.body.group[0].group_id,req.user._id)

            if (is_admin.ok){
                const initProject = new ProjectModel({
                    name: name,
                    group: req.body.group
                });
                initProject.save((errors) => {
                    if (errors) {
                        res.status(500).json({
                            message: 'Error create Project'
                        })
                    } else {
                        res.status(200).json({message: "Thank you for creating project"})
                    }
                })
            }else if(is_admin.ok === 'error'){
                return res.status(400).json({error: "Erreur Serveur"})
            }else{
                return res.status(400).json({error: 'error server vous etes pas admin'})
            }
        }
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