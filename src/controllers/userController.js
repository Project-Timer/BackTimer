const mongoose = require('mongoose');
const UserModel = require('../models/userModel');
const usermodel = mongoose.model("User");
const jwt = require('../utils/jwt');
const bcrypt = require('bcrypt');
const {registerValidation, loginValidation} = require('../utils/validation.js');

exports.create_user = async (req, res) => {
    console.log(req.body)
    const {error} = registerValidation(req.body);
    console.log("erreur joi ="+ error)
    if(error) return res.status(400).json({error: error.message});

    /* TODO voir ce probleme de BDD */
    await UserModel.findOne({email: req.body.email}, (error, result) =>{
        if (error) return res.status(500)
        if (result) return res.status(400).json({error: "This email is already used"})
    });

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    console.log(hashPassword)
    const user = new UserModel({
        lastname: req.body.lastname,
        name: req.body.name,
        email:req.body.email,
        password:hashPassword
    });
    user.save((error)=> {
        if (error) {
            res.status(500);
            console.log("result=" + error);
            res.json({message: "Erreur serveur."});
        }
        res.json({message: "Thank you for creating your account"});
    })
};

exports.login_user = async (req, res) => {
    const {error} = loginValidation(req.body);
    if (error)  return res.status(400).send({message: "Email or password is invalid"})

    const UserDb = await UserModel.findOne({email: req.body.email});
    if (!UserDb) return res.status(401).send({message: "Email or password is wrong"});

    const validPass = await bcrypt.compare(req.body.password, UserDb.password);
    if (!validPass) return res.status(401).send({message: "Email or password is wrong"});

    const token = jwt.genarateToken(UserDb._id);
    res.header('authorization', token).send({token: token,message: "login success"})
};
//GET ALL USER
exports.get_all_user = (req, res) => {
    usermodel.find({}, (error, usermodel) => {
        if (error) {
            res.status(500);
            console.log(error);
            res.json({message: "Server Error."})
        } else {
            res.status(200);
            res.json(usermodel);
        }
    });
};
//DELATE USER
exports.delete_user = (req, res) => {
    console.log(req.header);
    UserModel.remove({"_id": req.params.user_id}, (error) => {
        if (error) {
            res.status(500);
            console.log(error);
            res.json({message: "Server Error."})
        } else {
            res.status(200);
            res.json({"message": "user successful remove"});
        }
    })
};
//UPDATA USER
/**
 * TODO  Update user note work
 * */
exports.update_user = async (req, res) => {
    const {error} = registerValidation(req.body);
    if (error) return res.status(400).json({message: req.body});
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    console.log(hashPassword);
    //create a ne user
    const user = new UserModel({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });
    user.findOneAndUpdate({_id: req.params.user_id}, user, {new: true}, (error, user) => {
        if (error) {
            res.status(500);
            console.log(error);
            res.json({message: "Server error"});
        } else {
            res.status(200);
            res.json(user);
        }
    });
};
//GET USER WITH ID
exports.get_user = (req, res) => {
    //sconsole.log(req.headers('auth-token'));
    UserModel.findById({"_id": req.params.user_id}, (error, user) => {
        if (error) {
            res.status(500);
            console.log(error);
            res.json({message: "Error server"})
        } else {
            res.status(200);
            res.json(user);
        }
    })
};