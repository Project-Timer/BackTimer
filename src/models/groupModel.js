const mongoose = require('mongoose')
const mongooseSchema = mongoose.Schema

let groupSchema = new mongooseSchema(
    {
        name:{
            type: String,
            required: "Name is required"
        },
        user: [{
            user_id: {
                type: mongooseSchema.Types.ObjectId,
                ref: 'User',
                required: "User is required",
            },
            role: {
                type: mongooseSchema.Types.String,
                default: "user"
            },
            lastname:{
                type: mongooseSchema.Types.String,
                required: "lastname is required"
            },
            name:{
                type: mongooseSchema.Types.String,
                required: "Name is required"
            },
            email:{
                type: mongooseSchema.Types.String,
                required: "E-mail is required"
            }

        }],
        dateCreate: {
            type: Date,
            default: Date.now()
        },
        dateUpdate: {
            type: Date,
            default: Date.now()
        }
    }
);

module.exports = mongoose.model('Group', groupSchema)