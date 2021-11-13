const mongoose = require('mongoose');
const constant = require('../../Utils/constant');
const bcrypt = require('bcryptjs');
const User = mongoose.model('Users');

module.exports = {
    getUserByUsername(username){
        return User.findOne({username: username}).exec();
    },
    getUserByEmail(email){
        return User.findOne({email: email}).exec();
    },
    getUser(query){
        return User.findOne(query).exec();
    },
    addUser(info) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(info.password, constant.SALT_ROUNDS, (err, hash) => {
                const newUser = new User({
                    username: info.username,
                    userID: info.userID,
                    email: info.email,
                    name: info.name,
                    password: hash
                });
                try {
                    newUser.save(function(err) {
                        if (err) {
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                    });
                } catch (err) {
                    console.log('error at signUp' + err);
                }
            })
        })
    },
    updateUser(_id, info){
        info = info || {};
        return User.findOneAndUpdate({_id: _id }, {
            name: info.name || "",
            email: info.email || "",
            userID: info.userID || ""
        }).exec();
    }
};
