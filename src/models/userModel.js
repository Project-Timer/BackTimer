const mongoose = require('mongoose')
const mongooseSchema = mongoose.Schema

let userSchema = new mongooseSchema(
        {
            lastname: {
                type: String,
                required: "LastName is required",
            },
            name:{
                type: String,
                required: "Name is required"
            },
            email:{
                type: String,
                required: "E-mail is required"
            },
            active: {
                type: Boolean,
                default: true
            },
            password:{
                type: String,
                    required: "Password is required",
                    min: 8,
                    max: 255
            },
            dateCreate: {
                type: Date,
                default: Date.now()
            },
            dateUpdate: {
                type: Date
            }
        }
);

module.exports = mongoose.model('User', userSchema)