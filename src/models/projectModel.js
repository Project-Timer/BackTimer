const mongoose = require('mongoose')
const mongooseSchema = mongoose.Schema

let projectSchema = new mongooseSchema(
    {
        name: {
            type: String,
            required: "Name is required"
        },
        admin:[{
            user_id: {
                type: mongooseSchema.Types.ObjectId,
                ref: 'User',
                required: "User is required",
            }
        }],
        groups: [{
           group_id: {
                type: mongooseSchema.Types.ObjectId,
                ref: 'Group'
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

module.exports = mongoose.model('Project', projectSchema)