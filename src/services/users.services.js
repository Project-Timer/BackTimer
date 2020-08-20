const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Model = mongoose.model("User");
const ApplicationError = require('../errors/application.errors')
const {isValid} = require("../utils/validationParams");

/**
 *  hash password
 *  @param {String} password
 *  @return hash password
 * */
exports.hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
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
            return result
        })
    } else {
        throw new ApplicationError("The user id isn't valid", 500)
    }
}

/**
 *  Get a list of user with the request. The admin is the user
 *  that made the request and should not be included in the 
 *  body of the request.
 *  @param {Object} req
 *  @return user info
 * */
exports.getUserList = async (req) => {
    let result = []
    let data = {}
    let list = req.body.user
    list.push(req.user._id)

    const hasDuplicate = new Set(list).size !== list.length
    if (hasDuplicate) {
        throw new ApplicationError("There is duplicated values in the user list provided", 500)
    }

    for (let i = 0; i < list.length; i++) {
        const user = await this.getUser(list[i])

        if (user) {
            data = {
                user_id: user._id,
                lastname: user.lastname,
                name: user.name,
                email: user.email,
            }

            if (user._id.toString() === req.user._id) {
                data.role = "admin"
                result.push(data)
                return result
            } else {
                result.push(data)
            }
        } else {
            throw new ApplicationError("The user does not exist", 500)
        }
    }
}