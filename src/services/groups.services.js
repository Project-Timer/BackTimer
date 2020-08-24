const mongoose = require('mongoose')
const Model = mongoose.model("Group")
const ApplicationError = require("../errors/application.errors")
const {isValid} = require('../utils/validationParams')
const userService = require('../services/users.services')

/**
 *  Check if the user provided is the admin of the this group given his id. Throws errors accordingly if not.
 *  @param {String} group
 *  @param {String} user
 *  @return true
 * */
exports.checkIfAdmin = async (group, user) => {
    await this.checkId(group)

    const filter = {
        _id: group,
        admin: {
            _id: user
        }
    }
    
    const isAdmin = await  Model.exists(filter)
    if (!isAdmin) throw new ApplicationError("You must be an administrator of this group to perform this operation")

    return true
}

/**
 *  Check if a document exists and is valid given its id. Throws errors accordingly if not.
 *  @param {String} id
 *  @return true
 * */
exports.checkId = async (id) => {
    if (!isValid(id)) {
        throw new ApplicationError("This id is not valid : " + id, 400)
    } else {
        const exist = await Model.exists({_id: id})
        if (!exist) throw new ApplicationError("This id do not exist : " + id, 400)
    }

    return true
}

/**
 *  Check if a list of document exist and are valid given their id. Throws errors accordingly if not.
 *  @param {Array} list
 *  @return true
 * */
exports.checkList = async (list) => {
    let notExist = []
    let notValid = []
    
    const hasDuplicate = new Set(list).size !== list.length
    if (hasDuplicate) throw new ApplicationError("There is duplicated values in the group list provided")

    for(let i = 0; i < list.length; i++) {
        const id = list[i]
        if (!isValid(id)) {
            notValid.push(id)
        } else {
            const exists = await Model.exists({_id: id})
            if (!exists) notExist.push(id)
        }
    }
    
    if (notExist.length || notValid.length) {

        let errors = {
            message: "Some id are not valid or do not exist",
            notValid: notValid,
            notExist: notExist
        }

        throw new ApplicationError(errors)
    }

    return true
}

/**
 *  Check if the data sent in the request is valid for the operation. Throws errors accordingly if not.
 *  @param {Array} req
 *  @return true
 * */
exports.checkData = async (req) => {
    const users = req.body.users
    await userService.checkList(users)

    const group = req.params.id
    const name = req.body.name
    if (!name) throw new ApplicationError('Please insert a name')

    let used

    if (group) {
        const user = req.user._id
        await this.checkIfAdmin(group, user)

        used = await Model.exists({_id: {$nin: group},name: name.trim()})

        const admin = req.body.admin
        if (!admin) throw new ApplicationError('Please insert an admin id')
        await userService.checkId(req.body.admin)
    } else {
        used = await Model.exists({name: name})
    }

    if (used) throw new ApplicationError('This name is already used')
}
