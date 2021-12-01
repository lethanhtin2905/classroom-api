const Class = require('./classesService');
const mongoose = require('mongoose');
const constant = require('../../Utils/constant');
const Classes = mongoose.model('Classes');
const Users = mongoose.model('Users')

/* GET all classes. */
const allClasses = async (req, res, next) => {
    let classes = await Class.getAllClasses();
    const result = classes.map((cls, index) => {
        return {
            _id: cls._id,
            className: cls.className,
            classID: cls.classID,
            createBy: cls.createBy,
            desc: cls.desc,
            userList: cls.userList
        }
    })
    res.json(result);
};

const myClasses = async (req, res, next) => {
    let classes = await Class.getMyClasses({}, {}, req.user);
    const result = classes.map((cls, index) => {
        return {
            _id: cls._id,
            className: cls.className,
            classID: cls.classID,
            createBy: cls.createBy,
            desc: cls.desc,
            userList: cls.userList
        }
    })
    res.json(result);
};

const getUserOfClass = async (req, res, next) => {
    let users = await Class.getUserList({}, {}, req.params.id);
    const result = users.map((u, index) => {
        return {
            _id: u._id,
            name: u.name,
            email: u.email,
            classList: u.classList
        }
    })
    res.json(result);
};

const getClass = async (req, res, next) => {
    let cls = await Class.getClassById(req.params.id);
    const result = {
        _id: cls._id,
        className: cls.className,
        classID: cls.classID,
        createBy: cls.createBy,
        desc: cls.desc,
        userList: cls.userList
    }
    console.log(result);
    res.json(result);
};

// add class
const addClass = async (req, res, next) => {
    try {
        if (!req.body) {
            res.json({
                isSuccess: false,
                message: "Fail1"
            })
        } else {
            const currentUser = {
                _id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: true
            }
            const newClass = await Class.addClass({
                className: req.body.className,
                classID: req.body.classID,
                desc: req.body.desc,
                user: currentUser,
                userList: []
            });
            if (newClass) {
                res.json({
                    isSuccess: true,
                    newClass: newClass,
                    message: "Success"
                })
            } else {
                res.json({
                    isSuccess: false,
                    message: constant.classExisted
                })
            }
        }
    } catch (error) {
        res.json({
            isSuccess: false,
            message: "Fail2"
        })
    }
};

const invitedUser = async (req, res, next) => {
    try {
        if (!req.body) {
            res.json({
                isSuccess: false,
                message: "Fail1"
            })
        } else {
            const info = {
                currentUser: req.user,
                currentClass: req.params.id,
                email: req.body.email,
                role: req.body.role
            }
            const newClass = await Class.invited(info);
            res.json({
                isSuccess: true,
                message: "Success"
            })
        }
    } catch (error) {
        res.json({
            isSuccess: false,
            message: error
        })
    }
};

const getGradeStructure = async (req, res, next) => {
    let gradeStructure = await Class.getGradeStructure(req.params.id);
    const result = gradeStructure.map((grade, index) => {
        return {
            _id: grade._id,
            name: grade.name,
            grade: grade.grade,
        }
    })
    res.json(result);
}

const addGrade = async (req, res, next) => {
    try {
        if (!req.body) {
            res.json({
                isSuccess: false,
                message: "Fail1"
            })
        } else {
            const newGrade = await Class.addGrade({
                name: req.body.name,
                classID: req.params.id,
                grade: req.body.grade,
            });
            if (newGrade) {
                res.json({
                    isSuccess: true,
                    newGrade: newGrade,
                    message: "Success"
                })
            } else {
                res.json({
                    isSuccess: false,
                    message: constant.classExisted
                })
            }
        }
    } catch (error) {
        console.log(error)
        res.json({
            isSuccess: false,
            message: "Fail2"
        })
    }
}

const arrangeGrade = async (req, res, next) => {
    try {
        if (!req.body) {
            res.json({
                isSuccess: false,
                message: "Fail1"
            })
        } else {
            console.log(req.body.newItems)
            const newGrade = await Class.arrangeGrade({
                listGrade: req.body.newItems,
                classID: req.params.id,
            });
            if (newGrade) {
                res.json({
                    isSuccess: true,
                    // newGrade: newGrade,
                    message: "Success"
                })
            } else {
                res.json({
                    isSuccess: false,
                    message: constant.classExisted
                })
            }
        }
    } catch (error) {
        console.log(error)
        res.json({
            isSuccess: false,
            message: "Fail2"
        })
    }
}

module.exports = {
    allClasses,
    myClasses,
    addClass,
    invitedUser,
    getClass,
    getUserOfClass,
    getGradeStructure,
    addGrade,
    arrangeGrade
}