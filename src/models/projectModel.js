const mongoose = require('mongoose')
const mongooseSchema = mongoose.Schema

let projectSchema = new mongooseSchema(
    {
        name:{
            type: String,
            required: "Name is required"
        },
        group: [{
            group_id: {
                type: mongooseSchema.Types.ObjectId,
                ref: 'Group',
                required: "group_id is required",
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