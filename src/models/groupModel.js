const mongoose = require('mongoose')
const mongooseSchema = mongoose.Schema

let groupSchema = new mongooseSchema(
    {
        name:{
            type: String,
            required: "Name is required"
        },
        _id_admin:{
            type: String,
            default: 0
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