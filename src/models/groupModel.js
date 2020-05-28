const mongoose = require('mongoose')
const mongooseSchema = mongoose.Schema

let groupSchema = new mongooseSchema(
        {
            name:{
                type: String,
                 required: "Name is required"
            },
            active: {
                type: Boolean,
                default: true
            },
            admin: {
                type: String,
                required: "Admin is required"
            },
            members: {
                type: Array,
                default: []
            },
            dateCreate: {
                type: Date,
                default: Date.now()
            },
            dateUpdate: {
                type: Date
            }
        }
);

module.exports = mongoose.model('Group', groupSchema)