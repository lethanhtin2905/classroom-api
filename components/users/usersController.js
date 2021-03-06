const fetch = require("node-fetch");
const User = require("./userService");
const mongoose = require("mongoose");
const UserModel = mongoose.model("Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const constant = require("../../Utils/constant");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(
    "456562452797-8l37bdgcv5uuacglkgjpkobpvs6nelli.apps.googleusercontent.com"
);

/* POST LogIn. */
const logIn = async (req, res, next) => {
    const { username, password } = req.body;
    console.log(req.body);
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
                            email: user.email,
                            token: token,
                            classList: user.classList,
                        },
                    });
                } else {
                    res.json({
                        isSuccess: false,
                        message: constant.logInInvalid,
                    });
                }
            });
        } else {
            res.json({
                isSuccess: false,
                message: constant.logInInvalid,
            });
        }
    } else {
        res.json({
            isSuccess: false,
            message: constant.logInInvalid,
        });
    }
};

/* POST Sign up */
const signUp = async (req, res, next) => {
    try {
        let user1 = await User.getUserByUsername(req.body.username);
        let user2 = await User.getUserByEmail(req.body.email);
        if (user1) {
            res.json({
                isSuccess: false,
                message: constant.usernameExisted,
            });
        } else if (user2) {
            res.json({
                isSuccess: false,
                message: constant.emailExisted,
            });
        } else if (req.body.userID) {
            let user3 = await User.getUserByUserID(req.body.userID);
            if (user3) {
                res.json({
                    isSuccess: false,
                    message: constant.studentIDExisted,
                })
            }
        } else {
            const result = await User.addUser({
                username: req.body.username.trim(),
                password: req.body.password.trim(),
                name: req.body.name.trim(),
                email: req.body.email.trim(),
                userID: req.body.userID.trim(),
                classList: [],
            });

            if (result) {
                res.json({
                    isSuccess: true,
                    message: constant.signUpSuccess,
                    user: result,
                });
            } else {
                res.json({
                    isSuccess: false,
                    message: constant.signUpFail,
                });
            }
        }
    } catch (error) {
        res.json({
            isSuccess: false,
            message: constant.signUpFail,
        });
    }
};

const logInWithFacebook = async (req, res, next) => {
    const { accessToken, userID } = req.body;
    const urlGraphFacebook = `https://graph.facebook.com/${userID}?fields=id,name,email&access_token=${accessToken}`;
    fetch(urlGraphFacebook, {
        method: "GET",
    })
        .then((response) => response.json())
        .then((result) => {
            console.log(result);
            const { email, name } = result;
            UserModel.findOne({ email: email }).exec((err, user) => {
                if (err) {
                    return res.status(400).json({ error: err.message });
                } else if (user) {
                    const payload = { _id: user._id };
                    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
                    UserModel.findOneAndUpdate({ _id: user._id }, {
                        name: name,
                    }).exec();
                    res.json({
                        isSuccess: true,
                        token: token,
                        user: {
                            _id: user._id,
                            username: name,
                            userID: user.userID,
                            name: user.name,
                            email: user.email,
                            token: token,
                            classList: user.classList,
                        },
                    });
                } else {
                    const password = email + process.env.JWT_SECRET_KEY;
                    const newUser = new UserModel({
                        userID: "",
                        email: email,
                        name: name,
                        password: password,
                        classList: [],
                    });
                    try {
                        newUser.save();
                        const payload = { _id: newUser._id };
                        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
                        res.json({
                            isSuccess: true,
                            token: token,
                            user: {
                                _id: newUser._id,
                                userID: newUser.userID,
                                name: newUser.name,
                                email: newUser.email,
                                token: token,
                                classList: newUser.classList,
                            },
                        });
                    } catch (err) {
                        console.log("error at signUp" + err);
                    }
                }
            });
        });
};

const logInWithGoogle = async (req, res, next) => {
    const tokenId = req.body.tokenId;
    
    await client
        .verifyIdToken({
            idToken: tokenId,
            audience:
                "456562452797-8l37bdgcv5uuacglkgjpkobpvs6nelli.apps.googleusercontent.com",
        })
        .then((response) => {
            const { email_verified, name, email } = response.payload;
            if (email_verified) {
                UserModel.findOne({ email: email }).exec((err, user) => {
                    if (err) {
                        return res.status(400).json({ error: err.message });
                    } else if (user) {
                        const payload = { _id: user._id };
                        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
                        UserModel.findOneAndUpdate({ _id: user._id }, {
                            name: name,
                        }).exec();
                        res.json({
                            isSuccess: true,
                            token: token,
                            user: {
                                _id: user.id,
                                username: user.username,
                                userID: user.userID,
                                name: name,
                                email: user.email,
                                token: token,
                                classList: user.classList,
                            },
                        });
                    } else {
                        const password = email + process.env.JWT_SECRET_KEY;
                        const newUser = new UserModel({
                            userID: "",
                            email: email,
                            name: name,
                            password: password,
                            classList: [],
                        });
                        try {
                            newUser.save();
                            const payload = { _id: newUser._id };
                            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
                            res.json({
                                isSuccess: true,
                                token: token,
                                user: {
                                    _id: newUser._id,
                                    userID: newUser.userID,
                                    name: newUser.name,
                                    email: newUser.email,
                                    token: token,
                                    classList: newUser.classList,
                                },
                            });
                        } catch (err) {
                            console.log("error at signUp" + err);
                        }
                    }
                });
            }
        });
};

/* POST Update profile */
const updateProfile = async (req, res, next) => {
    try {
        if (!req.user._id) {
            res.json({
                isSuccess: false,
                message: constant.updateProfileFail,
            });
        } else {
            const updatedUser = await User.updateUser(req.user._id, {
                name: req.body.name.trim(),
                email: req.body.email.trim(),
                userID: req.body.userID.trim(),
            });
            if (updatedUser) {
                res.json({
                    isSuccess: true,
                    userUpdate: updatedUser,
                    message: constant.updateProfileSuccess,
                });
            } else {
                res.json({
                    isSuccess: false,
                    message: constant.studentIDExisted,
                });
            }
        }
    } catch (error) {
        res.json({
            isSuccess: false,
            message: constant.updateProfileFail,
        });
    }
};

module.exports = {
    logIn,
    signUp,
    logInWithFacebook,
    logInWithGoogle,
    updateProfile,
};
