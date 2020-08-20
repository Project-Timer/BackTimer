const mongoose = require('mongoose');
const model = mongoose.model("Project");
const {isValid} = require('../utils/validationParams')
const ApplicationError = require("../errors/application.errors");

exports.getGroupAdmin = (user_id, project_id) => {
    return new Promise((resolve, reject) => {
        let isValidUser = isValid(user_id)
        let isValidProject = isValid(project_id)
        if (!isValidUser) {
            reject(new ApplicationError("User id isn't valid"))
        } else if (!isValidProject) {
            reject(new ApplicationError("Project id isn't valid"))
        } else if (isValidUser && isValidProject) {
            model.find({
                                _id: project_id,
                                admin: {
                                        $elemMatch:{
                                            user_id: user_id
                                        }
                                }
                            }
                , (error, result) => {
                console.log(result)
                    if (error) {
                        reject(error)
                    } else {
                        if (result.length) {
                            resolve(result)
                        } else {
                            reject(new ApplicationError("You are not admin of this project"))
                        }
                    }
                })
        }
    })

}