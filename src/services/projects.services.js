const mongoose = require('mongoose')
const Model = mongoose.model("Project")
const groupServices = require('../services/groups.services')
const userServices = require('../services/users.services')
const {isValid} = require('../utils/validationParams')
const ApplicationError = require("../errors/application.errors")

/**
 *  Check if the user provided is the admin of the this group given his id. Throws errors accordingly if not.
 *  @param {String} project
 *  @param {String} user
 *  @return true
 * */
exports.checkIfAdmin = async (project, user) => {
    await this.checkId(project)

    const filter = {
        _id: project,
        admin: {
            _id: user
        }
    }
    
    const isAdmin = await  Model.exists(filter)
    if (!isAdmin) throw new ApplicationError("You must be an administrator of this project to perform this operation")

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
    if (hasDuplicate) throw new ApplicationError("There is duplicated values in the project list provided")

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
    const groups = req.body.groups
    await groupServices.checkList(groups)

    const project = req.params.id
    const name = req.body.name
    if (!name) throw new ApplicationError('Please insert a name')

    let used

    if (project) {
        const user = req.user._id
        await this.checkIfAdmin(project, user)

        used = await Model.exists({_id: {$nin: project},name: name.trim()})

        const admin = req.body.admin
        if (!admin) throw new ApplicationError('Please insert an admin id')
        await userServices.checkId(req.body.admin)
    } else {
        used = await Model.exists({name: name})
    }

    if (used) throw new ApplicationError('This name is already used')
}