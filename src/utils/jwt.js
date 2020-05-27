const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const UserModel = require('../models/userModel');
const usermodel = mongoose.model("User");
//Generate Token for login
module.exports.genarateToken = (User) => {
    const date = Date.now();
    return jwt.sign({
            _id: User,
            exp: date + 604800
        },
        process.env.TOKEN_SECRET);
};

module.exports.requiredToken = function (req, res, next) {
    const Token = req.header('Authorization');
    if (!Token) return res.status(401).send('Access Denied token required')
    try {
        req.user = jwt.verify(Token, process.env.TOKEN_SECRET);
        console.log(req.user)
        console.log("userid=" + req.user._id)
        usermodel.findOne({"_id": req.user._id}, (error, User) => {
            if (User.active) {
                next()
            } else {
                res.status(401).send({message: "Access Denied"})
            }
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({message: "Invalid Token"})
    }
}
