const mongoose = require('mongoose');
const userService = require("./users.services");
const model = mongoose.model("Group");

exports.getGroups = (req, res) => {
    model.find(
        {
            $or: [
                {
                    'user.user_id': req.params.user_id,
                }
            ]
        }, (error, groupmodel) => {
            if (error) {
                res.status(500);
                console.log(error);
                res.json({message: "Server Error."})
            } else {
                res.status(200);
                res.json(groupmodel);
            }
        });
};
let getUser = function (user) {
    return new Promise((resolve, reject) => {
        userService.get_user_info(user).then(function (response) {
            resolve(response)
        }).catch((err) => {
            console.log(err)
            reject(err)
        })
    })
}
exports.getUserList = (req) => {
    return new Promise((resolve, reject) => {
        let listuser = []
        let data = {}
        let listUser = req.body.user;
        listUser.push({"user_id": req.user._id})
        listUser.forEach((val, key) => {
            getUser(val.user_id).then(function (response) {
                console.log(response)
                data = {
                    user_id: response._id,
                    lastname: response.lastname,
                    name: response.name,
                    email: response.email,
                }
                if (response._id.toString() === req.user._id) {
                    data.role = "admin"
                    listuser.push(data)
                    if (req.body.user.length - 1 === key) {
                        resolve(listuser)
                    }
                }
            }).catch((err) => {
                console.log(err)
                reject(err)
            })
        })
    })
}
//TODO à delete
exports.is_AdminGroup = async (id_group, id_user) => {
    return new Promise((resolve, reject) => {
        model.find({
            _id: id_group,
            user: {
                $elemMatch:
                    {
                        user_id: id_user,
                        role: 'admin'
                    }
            }
        }, (errors, result) => {
            if (result) {
                resolve(result)
            } else {
                reject()
            }
        })
    })
}