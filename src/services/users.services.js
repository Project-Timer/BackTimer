const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const Model = mongoose.model("User")
const ApplicationError = require('../errors/application.errors')
const {isValid} = require("../utils/validationParams")

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