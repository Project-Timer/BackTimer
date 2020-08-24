const mongoose = require('mongoose')
const mongooseSchema = mongoose.Schema

let groupSchema = new mongooseSchema(
    {
        name:{
            type: String,
            required: "Name is required"
        },
        users: [{
            type: mongooseSchema.Types.ObjectId,
            ref: 'User',
            required: "User is required",
        }],
        admin:{
            type: mongooseSchema.Types.ObjectId,
            ref: 'User',
            required: "Admin is required",
        },
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