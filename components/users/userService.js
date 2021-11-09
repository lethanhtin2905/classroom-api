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
    addFacebookUser(info) {
        const newUser = new User({
            email: info.email,
            name: info.name,
            facebookID: info.facebookID,
        });
        try {
            return newUser.save();
        } catch (err) {
            console.log('error at signUp' + err);
        }
    },
};
