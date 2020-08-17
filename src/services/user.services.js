const service = require('../services/Services');
const bcrypt = require('bcrypt');
const userSchemaValidation = require('../utils/validation.js');

const mongoose = require('mongoose');

const Schema = require('../models/userModel');
const Model = mongoose.model("User");

module.exports = class UserService extends service {

    constructor(params) {
        super(Model);
        let result = this.validationUser(this.user)
        if (result.error === true) {
            throw new Error(result.errors)
        }
        this.user = new Schema(params)
    }
    /**
     *  @param {String} password
     *  @return hash password
     * */
    hashPassword = async (password) =>{
        try{
            const salt = await bcrypt.genSalt(10);
            return  await bcrypt.hash(password, salt);
        }catch (e){
            throw new Error("hash error")
        }
    }

    /**
     *  @param {Object} data to register
     *  @return {Object}
     * */
    validationUser =  (params) => {
       const {errors} =  userSchemaValidation(params)
        if(errors) {
            return {
                error: true,
                statusCode: 400,
                errors
            };
        }else{
            return {
                error: false,
                statusCode: 200,
            };
        }
    }

}
