const mongoose = require('mongoose');
const model = mongoose.model("Group");
const ifValidId = require('../utils/validationParams')
const ApplicationError = require("../errors/application.errors");

exports.getGroupAdmin = async (user_id, group_id) => {
    return new Promise((resolve, reject) => {
        model.find({
            _id: group_id,
            user: {
                $elemMatch:
                    {
                        role: 'admin',
                        user_id: user_id
                    }
            }
        }, (errors, result) => {
            if (result.length) {
                resolve()
            } else {
                reject()
            }
        })
    })
}
let getGroups = async (group_id) => {
    return new Promise((resolve, reject) => {
        ifValidId.ifValidId(group_id).catch(()=>{
            reject(new ApplicationError("This group id is not valid"))
        })
        model.findById({"_id": group_id}, (error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}
exports.createGroupList = function (group) {
    return new Promise((resolve, reject) => {
        let listGroup = []
        let data = {}
        group.forEach((val, key) => {
            getGroups(val).then(function (response) {
                data = {
                    group_id: response._id,
                    name: response.name
                }
                listGroup.push(data)
                if (group.length - 1 === key) {
                    resolve(listGroup)
                }
            }).catch((error) => {
                reject(error)
            })
        })
    });
}
