const mongoose = require('mongoose')
const Model = mongoose.model("Timer")
const ApplicationError = require('../errors/application.errors')
const {isValid} = require("../utils/validationParams")

/**
 *  Check if a document exists given an id
 *  @param {String} id
 *  @return boolean
 * */
exports.exists = async (id) => {
    if (!isValid(id)) throw new ApplicationError("This id is not valid : " + id, 400)
    return Model.exists({_id: id})
}