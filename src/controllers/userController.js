const mongoose = require('mongoose');
const Schema = require('../models/userModel');
const Model = mongoose.model("User");
const services = require('../services/users.services')
const bcrypt = require("bcrypt");
const jwt = require("../utils/jwt");
const ApplicationError = require('../errors/application.errors')
const {userSchemaValidation, loginValidation,} = require('../utils/validationSchema.js');
const {isValid} = require("../utils/validationParams");

exports.create_user = async (req, res) => {
    try {
        const filter = {
            email: req.body.email
        }

        let exist = await Model.findOne(filter, (error, result) => {
            if (error) {
                throw new Error(error)
            }
            return !!result;
        });

        let password = await services.hashPassword(req.body.password).then((result) => {
            return result
        }).catch((error) => {
            throw new Error(error)
        })
        if (!exist && password) {

            const newObject = new Schema({
                lastname: req.body.lastname,
                name: req.body.name,
                email: req.body.email,
                password: password
            });

            newObject.save((error, created) => {
                if (error) {
                    throw new Error(error)
                } else {
                    res.status(200).json(created)
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
        const filter = {
            email: req.body.email
        }

        const UserDb = await Model.findOne(filter, (error, result) => {
            if (error) {
                throw new Error(error)
            } else {
                return !!result;
            }
        });

        if (!UserDb) {
            throw new ApplicationError("Email or password is not valid", 403)
        }

        const validPass = await bcrypt.compare(req.body.password, UserDb.password);

        if (!validPass) {
            throw new ApplicationError("Email or password is not valid", 403)
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
        Model.find({}, (error, user) => {
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
        const filter = {
            "_id": req.user._id
        }
        Model.remove(filter, (error) => {
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
        const filter = {
            email: req.body.email,
            _id: {
                $nin: req.user._id
            }
        }

        let mailExist = await Model.findOne(filter, (error, result) => {
            if (error) {
                throw new Error(error)
            }
            return !!result;
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
                if (error) {
                    throw new Error(error)
                } else {
                    res.status(200).json(updated);
                }
            });
        }
    } catch (error) {
        console.log(error)
        if (error instanceof ApplicationError) {
            res.status(error.status).json({message: error.message})
        } else {
            res.status(500).json({message: 'Error server'})
        }
    }
};

exports.get_user = (req, res) => {
    try {
        if(isValid(req.params.user_id)) {
            const filter = {
                "_id": req.params.user_id
            }

            Model.findById(filter, (error, result) => {
                if (error) {
                    throw new Error(error)
                } else {
                    res.status(200);
                    res.json(result);
                }
            })
        } else {
            throw new ApplicationError("The group id is not valid", 200)
        }
    } catch (error) {
        console.log(error)
        if (error instanceof ApplicationError) {
            res.status(error.status).json({message: error.message})
        } else {
            res.status(500).json({message: 'Error server'})
        }
    }
};

exports.logout = (req, res) => {
    res.status(200).json({'message': 'You are successfully logged out'})
}