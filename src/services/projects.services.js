const mongoose = require('mongoose')
const Model = mongoose.model("Project")
const {isValid} = require('../utils/validationParams')
const ApplicationError = require("../errors/application.errors")
const userServices = require("./users.services");
const {getGroup} = require("./groups.services");

/**
 *  Get a project with its id
 *  @param {String} id
 *  @return Project info
 * */
exports.getProject = async (id) => {
    if (isValid(id)) {
        return Model.findById({_id: id}, (error, result) => {
            if (error) console.log(error)
            return result
        })
    } else {
        throw new ApplicationError("The project id isn't valid", 500)
    }
}

/**
 *  Get a project if the user id provided is the admin of the this project
 *  @param {String} project
 *  @param {String} user
 *  @return Project info
 * */
exports.isAdmin = async (project, user) => {
    const exist = await this.getProject(project)

    if (exist) {
        const filter = {
            _id: project,
            admin: {
                _id: user
            }
        }

        return Model.findOne(filter , (error, result) => {
            if (error) console.log(error)
            return result
        })

    } else {
        throw new ApplicationError("The project does not exist")
    }
}
/**
 *  Get a Member group relevant informations
 *  @param {string} id
 *  @return {Object} user info
 * */
exports.getFormatedUser = async (id) => {
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
 *  Get a group relevant informations
 *  @param {string} id
 *  @return {Object} user info
 * */
exports.getFormatedGroup = async (id) => {
    const group = await getGroup(id)
    if(group){
        return {
            "group_id": group._id,
            "name": group.name
        }
    }else{
        throw new ApplicationError("Group does not exist", 400)
    }
}
/**
 *  Get a list of group in project.
 *  @param {Object} list
 *  @return group info
 * */
exports.getGroupList = async (list) => {
    console.log(list)
    let result = []

    const hasDuplicate = new Set(list).size !== list.length
    console.log("____"+hasDuplicate)
    if (hasDuplicate) {
        throw new ApplicationError("There is duplicated values in the group list provided", 500)
    }

    for (let i = 0; i < list.length; i++) {
        const group = await this.getFormatedGroup(list[i])
        if (group) {
            result.push(group)
        } else {
            throw new ApplicationError("A group does not exist", 500)
        }
    }
    return result
}

