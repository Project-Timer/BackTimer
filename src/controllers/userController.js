const mongoose = require('mongoose')
const Schema = require('../models/userModel')
const Model = mongoose.model("User")
const userServices = require('../services/users.services')
const bcrypt = require("bcrypt")
const jwt = require("../utils/jwt")
const ApplicationError = require('../errors/application.errors')
const {errorHandler} = require('../utils/errorsHandler')

exports.register = async (req, res) => {
    try {
        await userServices.checkData(req)

        const password = await userServices.hashPassword(req.body.password)

        const newObject = new Schema({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: password
        })

        newObject.save((error, created) => {
            if (error) console.log(error)
            res.status(200).json(created)
        })

    } catch (error) {
        errorHandler(error, res)
    }
}

exports.login = async (req, res) => {
    try {
        await userServices.validation(req.body, false, false)

        const filter = {
            email: req.body.email
        }

        const UserDb = await Model.findOne(filter, (error, result) => {
            if (error) console.log(error)
            return !!result
        })
        if (!UserDb) throw new ApplicationError("Email or password is not valid", 403)

        const validPass = await bcrypt.compare(req.body.password, UserDb.password)
        if (!validPass) throw new ApplicationError("Email or password is not valid", 403)

        const token = jwt.genarateToken(UserDb._id)
        res.status(200).header('authorization', token).send({token: token, message: "login success"})

    } catch (error) {
        errorHandler(error, res)
    }
}

exports.getAllUser = async (req, res) => {
    try {
        Model.find({}, (error, user) => {
            if (error) console.log(error)
            res.status(200).json(user)
        })
    } catch (error) {
        errorHandler(error, res)
    }
}

exports.getUserById = async (req, res) => {
    try {
        const user = req.params.id
        await userServices.checkId(user)

        const result = await Model.findById({_id: user}, (error, result) => {
            if (error) console.log(error)
            res.status(200).json(result)
        })

    } catch (error) {
        errorHandler(error, res)
    }
}

exports.updateUser = async (req, res) => {
    try {
        await userServices.checkData(req)

        const filter = {
            _id: req.user._id
        }

        const update = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email
        }

        Model.findOneAndUpdate(filter, update, {new: true}, (error, updated) => {
            if (error) console.log(error)
            res.status(200).json(updated)
        })

    } catch (error) {
        errorHandler(error, res)
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const filter = {
            _id: req.user._id
        }

        Model.remove(filter, (error) => {
            if (error) console.log(error)
            res.status(200).json({"message": "user successfully deleted"})
        })

    } catch (error) {
        errorHandler(error, res)
    }
}

exports.logout = (req, res) => {
    res.status(200).json({'message': 'You are successfully logged out'})
}