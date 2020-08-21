const mongoose = require('mongoose')
const mongooseSchema = mongoose.Schema

let projectSchema = new mongooseSchema(
    {
        name: {
            type: String,
            required: "Name is required"
        },
        admin:{
            type: mongooseSchema.Types.ObjectId,
            ref: 'User',
            required: "Admin is required",
        },
        groups:  [{
            type: mongooseSchema.Types.ObjectId,
            ref: 'User',
            required: "User is required",
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

module.exports = mongoose.model('Project', projectSchema)