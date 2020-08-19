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
        group: [{
           group_id: {
                type: mongooseSchema.Types.ObjectId,
                ref: 'Group',
                required: "group_id is required",
            },
           name:{
                type: mongooseSchema.Types.String,
                ref: 'Group',
                required: "name is required"
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

module.exports = mongoose.model('Project', projectSchema)