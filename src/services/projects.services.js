const mongoose = require('mongoose')
const Model = mongoose.model("Project")
const {isValid} = require('../utils/validationParams')
const ApplicationError = require("../errors/application.errors")

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
            admin: {
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