const mongoose = require('mongoose')
const Model = mongoose.model("Timer")
const ApplicationError = require('../errors/application.errors')
const {isValid} = require("../utils/validationParams")

/**
 *  Get the active timer of the logged user. If no timer is active, return null
 *  @param {String} id
 *  @return timer info
 * */
exports.isActive = async (id) => {
    if (isValid(id))  {

        const filter = {
            user_id: id,
            dateEnd: null
        }

        return Model.findOne(filter, (error, result) => {
            if (error) console.log(error)
            return result
        })

    } else {
        throw new ApplicationError("The user id is not valid", 500)
    }
}
