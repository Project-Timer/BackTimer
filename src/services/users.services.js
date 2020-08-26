const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const Model = mongoose.model("User")
const ApplicationError = require('../errors/application.errors')
const {isValid} = require("../utils/validationParams")
const Joi = require('@hapi/joi');

/**
 *  hash password
 *  @param {String} password
 *  @return hashed password
 * */
exports.hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt)
    } catch (error) {
        throw new Error("hash error")
    }
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

exports.validation = async (data, firstName = true, lastName = true, email = true, password = true) =>{
    const schema = {}
    
    if (firstName) schema.firstName = Joi.string().required().error(new ApplicationError('Please insert a first name ',400))
    if (lastName) schema.lastName = Joi.string().required().error(new ApplicationError('Please insert a last name ',400))
    if (email) schema.email = Joi.string().min(8).required().email().error( new ApplicationError('Please insert a valid email',400))
    if (password) schema.password = Joi.string().min(8).required().error(new ApplicationError('Please insert a password of more than 8 characters',400))
    
    return Joi.validate(data, schema);
}

/**
 *  Check if the data sent in the request is valid for the operation. Throws errors accordingly if not.
 *  @param {Array} req
 *  @return true
 * */
exports.checkData = async (req) => {
    const isLogged = req.user
    const email = req.body.email
    let used
    
    if (isLogged) {
        const user = isLogged._id
        used = await Model.exists({_id: {$nin: user},email: email})
        await this.validation(req.body, true, true, true, false)
    } else {
        used = await Model.exists({email: email})
        await this.validation(req.body)
    }

    if (used) throw new ApplicationError('This email is already used')
}