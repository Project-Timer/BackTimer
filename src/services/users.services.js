const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const model = mongoose.model("User");
const ApplicationError = require('../errors/application.errors')

/**
 *  hash password
 *  @param {String} password
 *  @return hash password
 * */
exports.hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (e) {
        throw new Error("hash error")
    }
}
/**
 *  Get user info
 *  @param {String} user_id
 *  @return info user
 * */
exports.get_user_info = async (user_id) => {
    return new Promise((resolve, reject) => {
        model.findById({"_id": user_id}, (error, user) => {
            if (error) {
                console.log(error.code)
                reject(error)
            } else {
                resolve(user)
            }
        })
    })
}
exports.createUserList = (req) => {
    return new Promise((resolve, reject) => {
        let result = []
        let data = {}
        let list = req.body.user
        list.push(req.user._id)
        list.forEach((val, key) => {
            this.get_user_info(val).then(function (response) {
                if (response !== null) {
                    data = {
                        user_id: response._id,
                        lastname: response.lastname,
                        name: response.name,
                        email: response.email,
                    }
                    if (response._id.toString() === req.user._id) {
                        data.role = "admin"
                        result.push(data) //valide avec Joi
                        if (req.body.user.length - 1 === key) {
                            resolve(result)
                        }
                    } else {
                        result.push(data)
                    }
                } else {
                    throw new ApplicationError("Id error")
                }
            }).catch((err) => {
                reject(err)
            })
        })
    })
}
