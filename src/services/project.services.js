const mongoose = require('mongoose');
const Model = mongoose.model("Project");
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
            Model.find({
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

/**
 *  Get a project with its id
 *  @param {String} id
 *  @return Project info
 * */
exports.getProject = async (id) => {
    if (isValid(id)) {
        return Model.findById({_id: id}, (error, result) => {
            if (error) console.log(error)
            return result
        })
    } else {
        throw new ApplicationError("The project id isn't valid", 500)
    }
}

/**
 *  Get a project if the user id provided is the admin of the this project
 *  @param {String} project
 *  @param {String} user
 *  @return Project info
 * */
exports.isAdmin = async (project, user) => {
    const exist = await this.getProject(project)

    if (exist) {

        const filter = {
            _id: project,
            user: {
                $elemMatch:
                    {
                        user_id: user
                    }
            }
        }

        return Model.findOne(filter , (error, result) => {
            if (error) console.log(error)
            return result
        })

    } else {
        throw new ApplicationError("The project does not exist")
    }
}