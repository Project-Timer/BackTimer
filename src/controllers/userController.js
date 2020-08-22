const mongoose = require('mongoose');
const Schema = require('../models/userModel');
const Model = mongoose.model("User");
const userServices = require('../services/users.services')
const bcrypt = require("bcrypt");
const jwt = require("../utils/jwt");
const ApplicationError = require('../errors/application.errors')
const {errorHandler} = require('../utils/errorsHandler');

exports.register = async (req, res) => {
    try {
        const email = req.body.email
        exist = await Model.exists({email: email})
        if (exist) throw new ApplicationError("This email is already used")

        const password = await userServices.hashPassword(req.body.password)

        const newObject = new Schema({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: email,
            password: password
        });

        newObject.save((error, created) => {
            if (error) console.log(error)
            res.status(200).json(created)
        })

    } catch (error) {
        errorHandler(error, res)
    }
};

exports.login = async (req, res) => {
    //const {error} = loginValidation(req.body); TODO faire la validation
    // if (error) return res.status(400).send({message: "Email or password is invalid"})
    try {
        const filter = {
            email: req.body.email
        }

        const UserDb = await Model.findOne(filter, (error, result) => {
            if (error) console.log(error)
            return !!result;
        });
        if (!UserDb) throw new ApplicationError("Email or password is not valid", 403)

        const validPass = await bcrypt.compare(req.body.password, UserDb.password)
        if (!validPass) throw new ApplicationError("Email or password is not valid", 403)

        const token = jwt.genarateToken(UserDb._id);
        res.status(200).header('authorization', token).send({token: token, message: "login success"})
        
    } catch (error) {
        errorHandler(error, res)
    }
};

exports.getAllUser = async (req, res) => {
    try {
        Model.find({}, (error, user) => {
            if (error) console.log(error)
            res.status(200).json(user)
        })
    } catch (error) {
        errorHandler(error, res)
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = req.params.id
        const exist = await userServices.exists(user)
        if (!exist) throw new ApplicationError("The user provided does not exist")

        const result = await Model.findById({_id: user}, (error, result) => {
            if (error) console.log(error)
            res.status(200).json(result)
        })

    } catch (error) {
        errorHandler(error, res)
    }
};

exports.updateUser = async (req, res) => {
    //const {error} = updateUserValidation(req.body); //TODO: Voir validation
    //if (error) return res.status(400).json({message: error.message});
    try {
        const id = req.user._id
        const email = req.body.email
        const exist = await Model.exists({email: email, _id: {$nin: id}})
        if (exist) throw new ApplicationError("This email is already used")

        const filter = {
            _id: id
        }

        const update = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: email,
        };

        Model.findOneAndUpdate(filter, update, {new: true}, (error, updated) => {
            if (error) console.log(error)
            res.status(200).json(updated);
        });

    } catch (error) {
        errorHandler(error, res)
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const filter = {
            _id: req.user._id
        }

        Model.remove(filter, (error) => {
            if (error) console.log(error)
            res.status(200).json({"message": "user successfully deleted"});
        })

    } catch (error) {
        errorHandler(error, res)
    }
};

exports.logout = (req, res) => {
    res.status(200).json({'message': 'You are successfully logged out'})
}