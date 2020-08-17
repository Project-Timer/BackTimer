const jwt = require('../utils/jwt');
const UserService = require('../services/user.services.js')
const userSchemaValidation = require('../utils/validation.js');
const UserModel = require('../models/userModel');
const mongoose = require('mongoose');
const usermodel = mongoose.model("User");

exports.create_user = async (req, res) => {
    let Service;
    let User;
    try {
        Service = new UserService(req.body);
        User = Service.user
    } catch (e) {
        return res.status(401).json({error: e.error})
    }
    let exist = await Service.findOne({email: User.email}).then((result) => {
        return null != result.data;
    })
    await Service.hashPassword(User.password).then((result)=>{
        User.password = result
    })
    if(!exist){
        Service.save(User).then(() => {
            res.status(200).json({message: "Thank you for creating your account."});
        })
    }else{
        res.status(500).json({message: "email is already used"});
    }
};


exports.login_user = async (req, res) => {
    const {error} = loginValidation(req.body, false, false);
    if (error) return res.status(400).send({message: "Email or password is invalid"})

    const UserDb = await UserModel.findOne({email: req.body.email});
    if (!UserDb) return res.status(401).send({message: "Email or password is wrong"});

    const validPass = await bcrypt.compare(req.body.password, UserDb.password);
    if (!validPass) return res.status(401).send({message: "Email or password is wrong"});

    const token = jwt.genarateToken(UserDb._id);
    res.header('authorization', token).send({token: token, message: "login success"})
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
    const {error} = updateUserValidation(req.body, true, true, true, false);
    if (error) return res.status(400).json({message: error.message});
    //create a new user
    const user = new UserModel({
        lastname: req.body.lastname,
        name: req.body.name,
        email: req.body.email,
    });
    UserModel.findOneAndUpdate({_id: req.params.user_id}, user, (error, user) => {
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

exports.get_user_info = async (user_id) => {
    return new Promise((resolve, reject) => {
        UserModel.findById({"_id": user_id}, (error, user) => {
            if (error) {
                reject()
            } else {
                resolve(user)
            }
        })
    })
}