const mongoose = require('mongoose');
const Model = mongoose.model("Group");
const ApplicationError = require("../errors/application.errors");
const {isValid} = require("../utils/validationParams");

exports.getGroupAdmin = async (user_id, group_id) => {
    return new Promise((resolve, reject) => {
        Model.find({
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
        if(!isValid(group_id)){
            throw new ApplicationError("This group id is not valid")
        }else{
            Model.findById({"_id": group_id}, (error, result) => {
                if (error) {
                    reject(error)
                } else if(result) {
                    resolve(result)
                }else{
                    reject(new ApplicationError("Group id not find"))
                }
            })
        }
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

/**
 *  Get a group if the user id provided is the admin of the this group
 *  @param {String} group
 *  @param {String} user
 *  @return Group info
 * */
exports.isAdmin = async (group, user) => {
    const exist = await this.getProject(project)
    const isValid = isValid(project)

    if (exist && isValid) {
        const filter = {
            _id: group,
            user: {
                $elemMatch:
                    {
                        user_id: user,
                        role: 'admin'
                    }
            }
        }

        return Model.findOne(filter , (error, result) => {
            if (error) console.log(error)
            return result
        })

    } else if (isValid) {
        throw new ApplicationError("The project id is not valid")
    } else {
        throw new ApplicationError("The project does not exist")
    }
}

/**
 *  Get a group with its id
 *  @param {String} id
 *  @return Group info
 * */
exports.getGroup = async (id) => {
    if (isValid(id)) {
        return Model.findById({_id: id}, (error, result) => {
            if (error) console.log(error)
            return result
        })
    } else {
        throw new ApplicationError("The group id isn't valid", 500)
    }
}

/**
 *  Get a list of group with the request.
 *  @param {Object} req
 *  @return user info
 * */
exports.getGroupList = async (list) => {
    let result = []
    let data = {}

    const hasDuplicate = new Set(list).size !== list.length
    if (hasDuplicate) {
        throw new ApplicationError("There is duplicated values in the group list provided", 500)
    }

    for (let i = 0; i < list.length; i++) {
        const group = await this.getGroup(list[i])
        
        if (group) {
            
            data = {
                group_id: group._id,
                name: group.name
            }
            
            result.push(data)

        } else {
            throw new ApplicationError("A group does not exist", 500)
        }
    }

    return result
}