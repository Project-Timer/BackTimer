const mongoose = require('mongoose');

/***
 * Check if id is valid
 * @param {string} id
 * @returns {Boolean}
 */
exports.isValid = (id) =>{
        return mongoose.Types.ObjectId.isValid(id);
}