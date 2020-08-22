const mongoose = require('mongoose');
const Schema = require('../models/userModel');
const Model = mongoose.model("User");
const userServices = require('../services/users.services')
const bcrypt = require("bcrypt");
const jwt = require("../utils/jwt");
const ApplicationError = require('../errors/application.errors')
const {errorHandler} = require('../utils/errorsHandler')

exports.create_user = async (req, res) => {
    try {
        await userServices.registerValidation(req.body)
        const filter = {
            email: req.body.email
        }

        let exist = await Model.findOne(filter, (error, result) => {
            if (error) console.log(error)
            return result;
        });

        let password = await userServices.hashPassword(req.body.password)

        if (!exist && password) {

            const newObject = new Schema({
                lastname: req.body.lastname,
                name: req.body.name,
                email: req.body.email,
                password: password
            });

            newObject.save((error, created) => {
                if (error) console.log(error)
                res.status(200).json(created)
            })
        } else {
            throw new ApplicationError("This email is already used")
        }
    } catch (error) {
        errorHandler(error, res)
    }
};

exports.login_user = async (req, res) => {
    try {
        await userServices.loginValidation(req.body)
        const filter = {
            email: req.body.email
        }

        const UserDb = await Model.findOne(filter, (error, result) => {
            if (error) console.log(error)
            return !!result;
        });

        const validPass = await bcrypt.compare(req.body.password, UserDb.password)

        if (UserDb && validPass) {
            const token = jwt.genarateToken(UserDb._id);
            res.status(200).header('authorization', token).send({token: token, message: "login success"})
        } else {
            throw new ApplicationError("Email or password is not valid", 403)
        }

    } catch (error) {
        errorHandler(error, res)
    }
};

exports.get_all_user = async (req, res) => {
    try {
        Model.find({}, (error, user) => {
            if (error) console.log(error)
            res.status(200).json(user)
        })
    } catch (error) {
        errorHandler(error, res)
    }
};

exports.delete_user = async (req, res) => {
    try {
        const filter = {
            _id: req.user._id
        }

        Model.remove(filter, (error) => {
            if (error) console.log(error)
            res.status(200).json({"message": "user successful remove"});
        })

    } catch (error) {
        errorHandler(error, res)
    }
};

exports.update_user = async (req, res) => {
    //const {error} = updateUserValidation(req.body); //TODO: Voir validation
    //if (error) return res.status(400).json({message: error.message});
    try {
        await userServices.validationUpdateSchema(req.body)
        const filter = {
            email: req.body.email,
            _id: {
                $nin: req.user._id
            }
        }

        const mailExist = await Model.findOne(filter, (error, result) => {
            if (error) console.log(error)
            return result;
        });

        if (mailExist) {
            throw new ApplicationError("This email is already used", 200)
        } else {
            const filter = {
                _id: req.user._id
            }

            const update = {
                lastname: req.body.lastname,
                name: req.body.name,
                email: req.body.email,
            };

            Model.findOneAndUpdate(filter, update, {new: true}, (error, updated) => {
                if (error) console.log(error)
                res.status(200).json(updated);
            });
        }
    } catch (error) {
        errorHandler(error, res)
    }
};

exports.get_user = async (req, res) => {
    try {
        const id = req.params.user_id
        const result = await userServices.getUser(id)

        if(result) {
            res.status(200);
            res.json(result);
        } else {
            throw new ApplicationError("The user does not exist", 200)
        }
    } catch (error) {
        errorHandler(error, res)
    }
};

exports.logout = (req, res) => {
    res.status(200).json({'message': 'You are successfully logged out'})
}