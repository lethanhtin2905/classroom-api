const fetch = require ('node-fetch');
const User = require('./userService');
const mongoose = require('mongoose');
const UserModel = mongoose.model('Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const constant = require('../../Utils/constant');
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client('456562452797-8l37bdgcv5uuacglkgjpkobpvs6nelli.apps.googleusercontent.com')


/* POST LogIn. */
const logIn = async (req, res, next) => {
    const { username, password } = req.body;
    if (username && password) {
        const user = await User.getUserByUsername(username);
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result === true) {
                    const payload = { _id: user._id };
                    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
                    res.json({
                        isSuccess: true,
                        token: token,
                        user: {
                            _id: user._id,
                            username: user.username,
                            userID: user.userID,
                            name: user.name,
                            email: user.email
                        }
                    })
                } else {
                    res.json({
                        isSuccess: false,
                        message: constant.logInInvalid
                    })
                }
            })

        } else {
            res.json({
                isSuccess: false,
                message: constant.logInInvalid
            })
        }
    } else {
        res.json({
            isSuccess: false,
            message: constant.logInInvalid
        });
    }
};

/* POST Sign up */
const signUp = async (req, res, next) => {
    try {
        let user = await User.getUserByUsername(req.body.username);
        if (user) {
            res.json({
                isSuccess: false,
                message: constant.emailExisted
            })
        } else {
            const result = await User.addUser({
                username: req.body.username.trim(),
                password: req.body.password.trim(),
                name: req.body.name.trim(),
                email: req.body.email.trim(),
                userID: req.body.userID.trim(),
            });

            if (result) {
                res.json({
                    isSuccess: true,
                    message: constant.signUpSuccess,
                    user: result
                })
            } else {
                res.json({
                    isSuccess: false,
                    message: constant.signUpFail
                })
            }
        }
    } catch (error) {
        res.json({
            isSuccess: false,
            message: constant.signUpFail
        })
    }
};

const logInWithFacebook = async (req, res, next) => {
    const {accessToken, userID} = req.body;
    const urlGraphFacebook = `https://graph.facebook.com/${userID}?fields=id,name,email&access_token=${accessToken}`
    fetch(urlGraphFacebook,{
        method: 'GET',
    })
    .then(response=>response.json())
    .then(result=>{
        console.log(result);
        const {email,name} = result;
        UserModel.findOne({email: email}).exec((err, user) => {
            if(err) {
                return res.status(400).json({error: err.message});
            } else if (user) {
                const payload = { _id: user._id };
                const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
                res.json({
                    isSuccess: true,
                    token: token,
                    user: {
                        _id: user._id,
                        username: user.username,
                        userID: user.userID,
                        name: user.name,
                        email: user.email,
                    }
                })
            } else {
                const password = email + process.env.JWT_SECRET_KEY;
                const newUser = new UserModel({
                    userID: '',
                    email: email,
                    name: name,
                    password: password,
                });
                try {
                    newUser.save();
                    res.json({
                        isSuccess: true,
                        user: {
                            _id: newUser._id,
                            userID: newUser.userID,
                            name: newUser.name,
                            email: newUser.email,
                        }
                    })
                } catch (err) {
                    console.log('error at signUp' + err);
                }
            }
        });

    })
};

const logInWithGoogle = async (req, res, next) => {
    const { tokenID } = req.body;
    client.verifyIdToken({idToken: tokenID, audience: "456562452797-8l37bdgcv5uuacglkgjpkobpvs6nelli.apps.googleusercontent.com" })
        .then(response => {
            const {email_verified, name, email} = response.payload;
            if (email_verified) {
                UserModel.findOne({email: email}).exec((err, user) => {
                    if(err) {
                        return res.status(400).json({error: err.message});
                    } else if (user) {
                        const payload = { _id: user._id };
                        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
                        res.json({
                            isSuccess: true,
                            token: token,
                            user: {
                                _id: user.id,
                                username: user.username,
                                userID: user.userID,
                                name: user.name,
                                email: user.email,
                            }
                        })
                    } else {
                        const password = email + process.env.JWT_SECRET_KEY;
                        const newUser = new UserModel({
                            userID: '',
                            email: email,
                            name: name,
                            password: password,
                        });
                        try {
                            newUser.save();
                            res.json({
                                isSuccess: true,
                                user: {
                                    _id: newUser._id,
                                    userID: newUser.userID,
                                    name: newUser.name,
                                    email: newUser.email,
                                }
                            })
                        } catch (err) {
                            console.log('error at signUp' + err);
                        }
                    }
                });
            }
        })
};


module.exports = {
    logIn,
    signUp,
    logInWithFacebook,
    logInWithGoogle
    // updateProfile
};
