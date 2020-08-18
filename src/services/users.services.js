const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const model = mongoose.model("User");

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
                reject()
            } else {
                resolve(user)
            }
        })
    })
}