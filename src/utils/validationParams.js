const mongoose = require('mongoose');

/***
 * Check if id is valid
 * @param {string} id
 * @returns {Promise}
 */
module.exports.ifValidId = (id) => {
    return new Promise((resolve, reject) => {
        console.log(mongoose.Types.ObjectId(id))
        if (mongoose.Types.ObjectId(id)) {
            resolve()
        } else {
            reject()
        }
    });
}
module.exports.isValid = (id) => {
        return mongoose.Types.ObjectId.isValid(id);
}