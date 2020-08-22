const mongoose = require('mongoose')
const Model = mongoose.model("Project")
const {isValid} = require('../utils/validationParams')
const ApplicationError = require("../errors/application.errors")

/**
 *  Check if the user provided is the admin of the this project given his id
 *  @param {String} project
 *  @param {String} user
 *  @return {Boolean}
 * */
exports.isAdmin = async (project, user) => {
    const valid = isValid(project)
    if (!valid) throw new ApplicationError("The project id is not valid")

    const exist = await Model.exists({_id: project})
    if (!exist) throw new ApplicationError("The project does not exist")

    const filter = {
        _id: project,
        admin: {
            _id: user
        }
    }

    return Model.exists(filter)
}

/**
 *  Check if a document exists given an id
 *  @param {String} id
 *  @return boolean
 * */
exports.exists = async (id) => {
    if (!isValid(id)) throw new ApplicationError("This id is not valid : " + id, 400)
    return Model.exists({_id: id})
}