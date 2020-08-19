const mongoose = require('mongoose');
const model = mongoose.model("Project");
const {isValid} = require('../utils/validationParams')
const ApplicationError = require("../errors/application.errors");

exports.getGroupAdmin = (user_id, project_id) => {
    return new Promise((resolve, reject) => {
        let isValidUser = isValid(user_id)
        let isValidProject = isValid(project_id)
        console.log(isValidUser)
        console.log(isValidProject)

        if (!isValidUser) {
            let error = new ApplicationError("User id isn't valid")
            reject(error)
        } else if (!isValidProject) {
            let error = new ApplicationError("Project id isn't valid")
            console.log(error)
            reject(error)
        } else if(isValidUser && isValidProject){
            model.findOne({"_id": project_id, 'admin': {user_id: user_id}}, (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    if (result) {
                        resolve(result)
                    } else {
                        reject(new ApplicationError("You are not admin of this project"))
                    }
                }
            })
        }
    })

}