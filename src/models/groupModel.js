const mongoose = require('mongoose')
const mongooseSchema = mongoose.Schema

let groupSchema = new mongooseSchema(
    {
        name:{
            type: String,
            required: "Name is required"
        },
        admin:{
            user_id: {
                type: mongooseSchema.Types.ObjectId,
                ref: 'User',
                required: "User is required",
            }
        },
        user: [
            {
            user_id: {
                type: mongooseSchema.Types.ObjectId,
                ref: 'User',
                required: "User is required",
            },
            role: {
                type: String,
                default: "user"
            },
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