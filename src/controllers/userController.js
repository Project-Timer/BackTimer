const mongoose = require('mongoose');
const model = require('../models/userModel');
const schema = mongoose.model("User");
const services = require('../services/users.services')
const bcrypt = require("bcrypt");
const jwt = require("../utils/jwt");
const ApplicationError = require('../errors/application.errors')
const {userSchemaValidation, loginValidation,} = require('../utils/validationSchema.js');
const validationParams = require('../utils/validationParams')

exports.create_user = async (req, res) => {
    try {
        let exist = await model.findOne({email: req.body.email}, (error, result) => {
            if (error) {
                throw new Error(error)
            }
            return !!result;
        });

        let password = await services.hashPassword(req.body.password).then((result) => {
            return result
        }).catch((e) => {
            throw new Error(e)
        })
        if (!exist && password) {
            const user = new model({
                lastname: req.body.lastname,
                name: req.body.name,
                email: req.body.email,
                password: password
            });
            user.save((error) => {
                if (error) {
                    throw new Error(error)
                } else {
                    res.status(200).json({message: 'You have been successfully registered'})
                }
            })
        } else {
            throw new ApplicationError("This email is already used")
        }
    } catch (error) {
        console.log(error)
        if (error instanceof ApplicationError) {
            res.status(200).json(error)
        } else {
            res.status(500).json({message: 'Error server'})
        }
    }
};

exports.login_user = async (req, res) => {
    //const {error} = loginValidation(req.body); TODO faire la validation
    // if (error) return res.status(400).send({message: "Email or password is invalid"})
    try {
        const UserDb = await model.findOne({email: req.body.email}, (error, response) => {
            if (error) {
                throw new Error(error)
            } else {
                return !!response;
            }
        });
        if (!UserDb) {
            throw new ApplicationError("Email or password is wrong", 403)
        }

        const validPass = await bcrypt.compare(req.body.password, UserDb.password);
        if (!validPass) {
            throw new ApplicationError("Email or password is wrong", 403)
        }
        const token = jwt.genarateToken(UserDb._id);
        res.header('authorization', token).send({token: token, message: "login success"}).status(200)
    } catch (error) {
        console.log(error)
        if (error instanceof ApplicationError) {
            res.status(200).json(error)
        } else {
            res.status(500).json({message: 'Error server'})
        }
    }

};

exports.get_all_user = (req, res) => {
    try {
        model.find({}, (error, user) => {
            if (error) {
                throw new Error(error)
            } else {
                res.status(200).json(user);
            }
        })
    } catch (error) {
        console.log(error)
        if (error instanceof ApplicationError) {
            res.status(200).json(error)
        } else {
            res.status(500).json({message: 'Error server'})
        }
    }
};

exports.delete_user = (req, res) => {
    try {
        model.remove({"_id": req.params.user_id}, (error) => {
            if (error) {
                throw new Error(error)
            } else {
                res.status(200);
                res.json({"message": "user successful remove"});
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Error server'})
    }
};

exports.update_user = async (req, res) => {
    //const {error} = updateUserValidation(req.body); //TODO: Voir validation
    //if (error) return res.status(400).json({message: error.message});
    try {
        let mailExist = model.findOne({email: req.body.email, _id: {$nin: req.user._id}}, (error, result) => {
            if (error) {
                throw new Error(error)
            }
            return !!result;
        });
        if (mailExist) {
            throw new ApplicationError("This email is already used")
        } else {
            const user = {
                lastname: req.body.lastname,
                name: req.body.name,
                email: req.body.email,
            };
            model.findOneAndUpdate({_id: req.params.user_id}, user, {new: true}, (error, user) => {
                if (error) {
                    throw new Error(error)
                } else {
                    res.status(200);
                    res.json(user);
                }
            });
        }
    } catch (error) {
        console.log(error)
        if (error instanceof ApplicationError) {
            res.status(200).json(error)
        } else {
            res.status(500).json({message: 'Error server'})
        }
    }
};

exports.get_user = (req, res) => {
    try {
        validationParams.ifValidId(req.params.user_id).then(() => {
            model.findById({"_id": req.params.user_id}, (error, user) => {
                if (error) {
                    throw new Error(error)
                } else {
                    res.status(200);
                    res.json(user);
                }
            })
        }).catch(() => {
            res.status(500).json({message: 'Argument passed in must be a valid group id'})
        })
    } catch (error) {
        console.log(error)
        if (error instanceof ApplicationError) {
            res.status(200).json(error)
        } else {
            res.status(500).json({message: 'Error server'})
        }
    }
};

exports.logout = (req, res) => {
    // TODO log Winston
    res.status(200).json({'message': 'You are successfully logged out'})
}