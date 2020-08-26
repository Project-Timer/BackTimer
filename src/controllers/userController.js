const mongoose = require('mongoose')
const Schema = require('../models/userModel')
const Model = mongoose.model("User")
const userServices = require('../services/users.services')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const ApplicationError = require('../errors/application.errors')
const jwtUtils = require("../utils/jwt");
const emailService = require("../utils/emailService");
const {errorHandler} = require('../utils/errorsHandler')

exports.register = async (req, res) => {
    try {
        await userServices.checkData(req)

        const password = await userServices.hashPassword(req.body.password)

        const newObject = new Schema({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            verificationToken: null,
            password: password
        })

        const tokenVerifiaction = jwtUtils.genarateToken(newObject._id, 1)
        newObject.verificationToken = tokenVerifiaction
        await emailService.sendTokenEmail(tokenVerifiaction, req.body.email, req.body.firstName, 'confirmationMail')

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

        const verify = await Model.exists({_id: UserDb._id, verified: {$nin: null}})
        if (!verify) throw new ApplicationError("Please verify your account", 401)

        const validPass = await bcrypt.compare(req.body.password, UserDb.password)
        if (!validPass) throw new ApplicationError("Email or password is not valid", 403)

        const token = jwtUtils.genarateToken(UserDb._id)
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

        await Model.findById({_id: user}, (error, result) => {
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

exports.validateAccount = async (req, res) => {
    try {
        const token = req.params.token
        const user = jwt.verify(token, process.env.TOKEN_SECRET);

        const filter = {
            _id: user._id,
            verificationToken: token
        }
        const update = {
            verified: Date.now(),
            verificationToken: undefined
        }

        const result = await Model.findOneAndUpdate(filter, update, (error, result) => {
            if (error) console.log(error)
            return result
        })
        if (result) {
            res.status(200).json({message: 'Your account has been successfully activated.'})
        } else {
            throw new ApplicationError('Invalid validation token, It might has been used already')
        }
    } catch (error) {
        errorHandler(error, res)
    }
}

exports.resendValidation = async (req, res) => {
    try {
        const email = req.body.email

        const filter = {
            email: email,
        }

        const user = await Model.findOne(filter, (error, result) => {
            if (error) console.log(error)
            return result
        })

        if (!user) throw new ApplicationError('The email provided is either not registered')

        await emailService.sendTokenEmail(user.tokenVerification, email, user.firstName, 'confirmationMail')

        res.status(200).json({message: 'An email has been sent to your address. If you do not see it in your inbox, please check your spams.'})

    } catch (error) {
        errorHandler(error, res)
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        const email = req.body.email

        const filter = {
            email: email,
            verified: {$nin: null}
        }

        const user = await Model.findOne(filter, (error, result) => {
            if (error) console.log(error)
            return result
        })

        if (!user) throw new ApplicationError('The email provided is either not registered, or not verified. If you register with this email, please check your inbox to verify it')

        const tokenVerification = jwtUtils.genarateToken(user._id)

        const update = {
            verificationToken: tokenVerification
        }

        const result = await Model.findOneAndUpdate(filter, update, (error, result) => {
            if (error) console.log(error)
            return result
        })
        
        await emailService.sendTokenEmail(tokenVerification, email, user.firstName, 'resetPassword')

        res.status(200).json({message: 'An email has been sent to your address. If you do not see it in your inbox, please check your spams.'})

    } catch (error) {
        errorHandler(error, res)
    }
}

exports.resendPassword = async (req, res) => {
    try {
        const email = req.body.email

        const filter = {
            email: email,
            verified: {$nin: null}
        }

        const user = await Model.findOne(filter, (error, result) => {
            if (error) console.log(error)
            return result
        })

        if (!user) throw new ApplicationError('The email provided is either not registered, or not verified. If you register with this email, please check your inbox to verify it')

        await emailService.sendTokenEmail(user.tokenVerification, email, user.firstName, 'resetPassword')

        res.status(200).json({message: 'An email has been sent to your address. If you do not see it in your inbox, please check your spams.'})

    } catch (error) {
        errorHandler(error, res)
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const token = req.params.token
        const user = jwt.verify(token, process.env.TOKEN_SECRET);

        const filter = {
            _id: user._id,
            verificationToken: token
        }

        const exist = await Model.exists(filter)

        if (exist) {
            const password = await userServices.hashPassword(req.body.password)

            const filter = {
                _id: user._id
            }
            
            const update = {
                password: password,
                verificationToken: undefined
            }

            const result = await Model.findOneAndUpdate(filter, update, (error, result) => {
                if (error) console.log(error)
                res.status(200).json({message: 'Your password has been successfully changed'})
            })

        } else {
            throw new ApplicationError('Invalid reset token')
        }
    } catch (error) {
        errorHandler(error, res)
    }
}