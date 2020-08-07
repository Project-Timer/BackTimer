const mongoose = require('mongoose');
const ProjectModel = require('../models/projectModel');
const projectmodel = mongoose.model("Project");
const groupController = require('../controllers/groupController')


exports.createProject = async (req, res) => {
    let name = req.body.name.trim();
    let group = function (grp_id) {
        return new Promise((resolve, reject) => {
            groupController.getGroups(grp_id).then(function (response) {
                resolve(response)
            }).catch((err) => {
                console.log(err)
                reject(err)
            })
        })
    }
    await ProjectModel.findOne({name: req.body.name}, (error, result) => {
        if (result) {
            res.status(400).json({message: "this project was already exist"})
        } else {
            let createGroupList = function () {
                return new Promise((resolve, reject) => {
                    let listGroup = []
                    let data = {}
                    let AllGroup = req.body.group;
                    AllGroup.forEach((val, key) =>  {
                        group(val._id).then(function(response){
                            data = {
                                _id: response._id,
                                name: response.name
                            }
                            let user = new Map();
                            for (user of response.user){
                                console.log('this token user: '+ req.user._id + " User group is: " + user._id + " and role:" + user.role);
                                if(req.user._id === user._id && user.role === "admin"){
                                    listGroup.push(data)
                                }else{
                                    reject(response._id)
                                }
                            }
                            if (req.body.group.length - 1 === key) {
                                resolve(listGroup)
                            }
                        }).catch((err) =>{
                            console.log(err)
                            reject()
                        })
                    })
                });
            }
            createGroupList().then(function (response){
                if(response){
                    const initProject = new ProjectModel({
                        group_id: response,
                        name: req.body.name
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
            }).catch((err)=>{
                res.status(400).json({message: "You are not admin of group "+err})
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