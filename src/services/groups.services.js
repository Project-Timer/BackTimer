const mongoose = require('mongoose')
const Model = mongoose.model("Group")
const ApplicationError = require("../errors/application.errors")
const {isValid} = require('../utils/validationParams')

/**
 *  Check if the user provided is the admin of the this group given his id
 *  @param {String} group
 *  @param {String} user
 *  @return {Boolean}
 * */
exports.isAdmin = async (group, user) => {
    const groupValid = isValid(group)
    if (!groupValid) throw new ApplicationError("The group id is not valid")

    const exist = await Model.exists({_id: group})
    if (!exist) throw new ApplicationError("The group does not exist")

    const filter = {
        _id: group,
        admin: {
            _id: user
        }
    }

    return Model.exists(filter)
}

/**
 *  Check if a document exists given its id
 *  @param {String} id
 *  @return {Boolean}
 * */
exports.exists = async (id) => {
    if (!isValid(id)) throw new ApplicationError("This id is not valid : " + id, 400)
    return Model.exists({_id: id})
}

/**
 *  Check if a list of document exist given their id
 *  @param {Array} list
 *  @return {Boolean}
 * */
exports.listExist = async (list) => {
    const hasDuplicate = new Set(list).size !== list.length
    if (hasDuplicate) throw new ApplicationError("There is duplicated values in the group list provided")

    for(let i = 0; i < list.length; i++) {
        if (!this.exists(list[i])) throw new ApplicationError("This id does not exist : " + list[i], 400)
    }
    return true
}