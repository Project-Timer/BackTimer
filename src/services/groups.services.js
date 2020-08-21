const mongoose = require('mongoose')
const Model = mongoose.model("Group")
const ApplicationError = require("../errors/application.errors")
const {isValid} = require('../utils/validationParams')
const userServices = require("../services/users.services")
/**
 *  Get a group if the user id provided is the admin of the this group
 *  @param {String} group
 *  @param {String} user
 *  @return Group info
 * */
exports.isAdmin = async (group, user) => {
    const exist = await this.getGroup(group)
    const groupValid = isValid(group)
    if (exist && groupValid) {
        const filter = {
            _id: group,
            admin: {
                        _id: user
                    }
            }
        return Model.findOne(filter, (error, result) => {
            if (error) console.log(error)
            return result
        })


    } else if (groupValid) {
        throw new ApplicationError("The group id is not valid")
    } else {
        throw new ApplicationError("The group does not exist")
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
 *  Get a list of user in group
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

/**
 *  Get a Member group relevant informations
 *  @param {string} id
 *  @return {Object} user info
 * */
exports.getFormatedMember = async (id) => {
   const user = await userServices.getUser(id)
   if(user){
       return {
           "user_id": user._id,
           "lastname": user.lastname,
           "name": user.name,
           "email": user.email
       }
   }else{
       throw new ApplicationError("User does not exist", 400)
   }
}
/**
 *  Get a list of user with the request. The admin is the user
 *  that made the request and should not be included in the
 *  body of the request.
 *  @param {Object}usersList
 *  @return {Object} user info
 * */
exports.getUserList = async (usersList) => {
    let result = []
    let data = {}
    let list = usersList

    const hasDuplicate = new Set(list).size !== list.length
    if (hasDuplicate) {
        throw new ApplicationError("There is duplicated values in the user list provided", 500)
    }

    for (let i = 0; i < list.length; i++) {
        const user = await this.getFormatedMember(list[i])

        if (user) {
            result.push(user)
        } else {
            throw new ApplicationError("A user does not exist", 500)
        }
    }
    return result
}
/**
 *  check if list of group exist
 *  @param {Object} List
 *  @return {Boolean}
 * */
exports.listExist = async (list) => {
    console.log(list)
    let filter = {"_id": {"$in": list}}
    const result =  await Model.find(filter, function (error, result) {
        if (error) console.log(error)
        return result
    })
    if(result){
        return list.length === result.length
    }else{
        return false
    }
}

/**
 * check if group name is already used by another group
 * @param id group id
 * @param name group name
 * @return {Boolean}
 * */
exports.groupExist = async (id,name)=>{
    const filter = {
        _id: {
            $nin: id
        },
        name: name
    }
    const result =  await Model.findOne(filter, function (error, result) {
        if (error) console.log(error)
        return result
    })

    return !!result;
}