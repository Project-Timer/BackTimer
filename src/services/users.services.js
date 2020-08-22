const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const Model = mongoose.model("User")
const ApplicationError = require('../errors/application.errors')
const {isValid} = require("../utils/validationParams")
const Joi = require('@hapi/joi');

/**
 *  hash password
 *  @param {String} password
 *  @return hash password
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
 *  Check if a document exists given an id
 *  @param {String} id
 *  @return boolean
 * */
exports.exists = async (id) => {
    if (!isValid(id)) throw new ApplicationError("This id is not valid : " + id, 400)
    return Model.exists({_id: id})
}

/**
 *  Check if a list of document exist given their id
 *  @param {Array} list
 *  @return boolean
 * */
exports.listExist = async (list) => {
    const hasDuplicate = new Set(list).size !== list.length
    if (hasDuplicate) throw new ApplicationError("There is duplicated values in the group list provided")

    for(let i = 0; i < list.length; i++) {
        const exist = await this.exists(list[i])
        if (!exist) throw new ApplicationError("This id does not exist : " + list[i], 400)
    }
    return true
}

exports.loginValidation = async (data) =>{
    const schema = {
        email: Joi.string().min(8).required().email().error(new ApplicationError('Please insert a valid email',400)),
        password: Joi.string().min(8).required().error(new ApplicationError('Please insert a valid password',400))
    }
    return Joi.validate(data, schema);
}
exports.registerValidation = async (data) =>{
        const schema = {
            firstName: Joi.string().required().error(new ApplicationError('Please insert a first name ',400)),
            lastName: Joi.string().required().error(new ApplicationError('Please insert a last name ',400)),
            email: Joi.string().min(8).required().email().error( new ApplicationError('Please insert a valid email',400)),
            password: Joi.string().min(8).required().error(new ApplicationError('Please insert a password of more than 8 characters',400))
        };
        return Joi.validate(data, schema);
}
exports.validationUpdateSchema = async (data) =>{
    const schema = {
        firstName: Joi.string().required().error(new ApplicationError('Please insert a first name ',400)),
        lastName: Joi.string().required().error(new ApplicationError('Please insert a last name ',400)),
        email: Joi.string().min(8).required().email().error( new ApplicationError('Please insert a valid email',400)),
      };
    return Joi.validate(data, schema);
}