const mongoose = require('mongoose')
const mongooseSchema = mongoose.Schema

let timerSchema = new mongooseSchema(
    {
        project_id: {
            type: mongooseSchema.Types.ObjectId,
            ref: 'Project',
            required: "project_id is required",
        },
        user_id: {
            type: mongooseSchema.Types.ObjectId,
            ref: 'User',
            required: "user_id is required",
        },
        dateStart: {
            type: Date,
            default: Date.now()
        },
        dateEnd: {
            type: Date
        }
    }
);

module.exports = mongoose.model('Timer', timerSchema)