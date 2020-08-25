const mongoose = require('mongoose')
const mongooseSchema = mongoose.Schema

let userSchema = new mongooseSchema(
        {
            firstName:{
                type: String,
                required: "First name is required"
            },
            lastName: {
                type: String,
                required: "Last Name is required",
            },
            email:{
                type: String,
                required: "E-mail is required"
            },
            verificationToken:{
                type:String
            },
            verified: {
                type: Date,
                default: null
            },
            password:{
                type: String,
                    required: "Password is required",
                    min: 8,
                    max: 255
            },
            create: {
                type: Date,
                default: Date.now()
            },
            update: {
                type: Date
            }
        }
);

module.exports = mongoose.model('User', userSchema)