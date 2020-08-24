const mongoose = require('mongoose')
const Schema = mongoose.Schema

let timerSchema = new Schema(
    {
        project: {
            type: Schema.Types.ObjectId,
            ref: 'Project',
            required: "project is required"
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: "user is required"
        },
        description: {
            type: String
        },
        dateStart: {
            type: Date,
        },
        dateEnd: {
            type: Date
        }
    }
);

module.exports = mongoose.model('Timer', timerSchema)