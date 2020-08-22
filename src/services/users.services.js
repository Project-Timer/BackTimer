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
 *  Get a user with its id
 *  @param {String} id
 *  @return user info
 * */
exports.getUser = async (id) => {
    if (isValid(id)) {
        return Model.findById({_id: id}, (error, result) => {
            if (error) console.log(error)
            return result
        })
    } else {
        throw new ApplicationError("The user id isn't valid", 400)
    }
}



/**
 *  check if list of user exist
 *  @param {Object} List
 *  @return {Boolean}
 * */
exports.listExist = async (list) => {
    let filter = {"_id": {"$in": list}}
    const result =  await Model.find(filter, function (error, result) {
        if (error) console.log(error)
        return result
    })
    if(result){
        return list.length === result.length
    }else{
        return false
    }
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
            lastname: Joi.string().required().error(new ApplicationError('Please insert a last name ',400)),
            name: Joi.string().required().error(new ApplicationError('Please insert a name ',400)),
            email: Joi.string().min(8).required().email().error( new ApplicationError('Please insert a valid email',400)),
            password: Joi.string().min(8).required().error(new ApplicationError('Please insert a password of more than 8 characters',400))
        };
        return Joi.validate(data, schema);
}
exports.validationUpdateSchema = async (data) =>{
    const schema = {
        lastname: Joi.string().required().error(new ApplicationError('Please insert a last name ',400)),
        name: Joi.string().required().error(new ApplicationError('Please insert a name ',400)),
        email: Joi.string().min(8).required().email().error( new ApplicationError('Please insert a valid email',400)),
      };
    return Joi.validate(data, schema);
}