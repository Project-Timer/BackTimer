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
            groupController.is_AdminGroup(req.body.group_id,req.user).then((response) =>{
                if(response){
                    const initProject = new ProjectModel({
                        name: req.body.name,
                        group_id: req.body.group_id
                    });
                    initProject.save((err) => {
                        console.log(err)
                        if (err) {
                            res.status(500).json({
                                message: 'Error create Project'
                            })
                        }else {
                            res.status(200).json({message: "Thank you for creating project"})
                        }
                    })
                }
            }).catch(()=>{
                return res.status(400).json({error: 'error server vous etes pas admin'})
            })
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

    const project = {
        name: req.body.name,
    };

    const filter = {
        _id: req.params.project_id
    }
    ProjectModel.findOneAndUpdate(filter,project,(error, group) => {
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

exports.getProjectPromise = async(project_id) =>{
    return new Promise((resolve, reject)=>{
        ProjectModel.findById({"_id": project_id}, (error, project) => {
            if (error) {
                console.log(error)
                reject()
            } else {
                console.log(project)
                resolve(project)
            }
        })
    })
}