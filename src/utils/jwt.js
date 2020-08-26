const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const schema = require('../models/userModel');
const model = mongoose.model("User");
module.exports.genarateToken = (User) => {
    const date = Date.now();
    return jwt.sign({
            _id: User,
            exp: date + 604800
        },
        process.env.TOKEN_SECRET);
};

module.exports.requiredToken = async (req, res, next) => {
    const Token = req.header('Authorization');
    if (!Token) return res.status(401).send('Access Denied token required')
    try {
        let authToken = parseAuthToken(Token);
        req.user = jwt.verify(authToken, process.env.TOKEN_SECRET);
        const user = await model.findOne({"_id": req.user._id}, (error, User) => {
            if (User) {
                return User
            } else {
                res.status(401).send({message: "Access Denied"})
            }
        });
        if (user) {
            const exist = await model.exists({_id: req.user._id, verified: {$nin: null}});
            if (exist) {
                next()
            } else {
                res.status(401).send({message: "Please verify your account"})
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({message: "Invalid Token"})
    }
}

function parseAuthToken(authorization) {
    return (authorization != null) ? authorization.replace('Bearer ', '') : null;
}

