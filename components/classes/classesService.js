const mongoose = require('mongoose');
const constant = require('../../Utils/constant');
const Classes = mongoose.model('Classes');
const Users = mongoose.model('Users')
const GradeStructure = mongoose.model('GradeStructure')
const nodemailer = require('nodemailer');

// Configure nodemailer
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "gradebook18120595@gmail.com",
        pass: "18120595"
    }
});

var mailOptions = {
    from: "gradebook18120595@gmail.com"
};

module.exports = {
    async getAllClasses(query, option) {
        query = query || {};
        option = option || {};

        const allClass = Classes.find(query)
        const a = await allClass.exec()
        return a;
    },
    async getClassById(id) {

        const cls = Classes.findOne({ _id: id })
        const c = await cls.exec()
        return c;
    },

    async getMyClasses(query, option, infoUser) {
        query = query || {};
        option = option || {};
        let myClasses = [];
        let listClass = [];
        const currentUser = Users.find({ _id: infoUser._id })
        const isCurrentUser = await currentUser.exec()
        if (isCurrentUser === []) {
            myClasses = []
        } else {
            myClasses = isCurrentUser[0].classList;
            for (var i = 0; i < myClasses.length; i++) {
                const class_i = Classes.find({ _id: myClasses[i]._id });
                const cls_i = await class_i.exec();
                listClass = listClass.concat(cls_i);
            }
        }

        return listClass;
    },

    async getUserList(query, option, id) {
        query = query || {};
        option = option || {};
        let user = [];
        let listUser = [];
        const currentClass = Classes.find({ _id: id })
        const isCurrentClass = await currentClass.exec()
        if (isCurrentClass === []) {
            user = []
        } else {
            user = isCurrentClass[0].userList;
            for (var i = 0; i < user.length; i++) {
                const user_i = Users.find({ _id: user[i]._id });
                const u_i = await user_i.exec();
                listUser = listUser.concat(u_i);
            }
        }

        return listUser;
    },

    async addClass(info) {
        info = info || {};
        info.className = info.className || "";
        info.classID = info.classID || "";
        info.desc = info.desc || "";
        info.user = info.user || {};
        info.userList = info.userList || [];
        const classExist = Classes.find({ classID: info.classID })
        const isClassExist = await classExist.exec()
        if (isClassExist.length !== 0) {
            console.log('môn học đã tồn tại', isClassExist);
            return null;
        } else {
            const newClass = new Classes({
                className: info.className,
                classID: info.classID,
                createBy: {
                    _id: info.user._id,
                    name: info.user.name,
                    email: info.user.email,
                },
                desc: info.desc,
                userList: info.userList
            });
            const user = {
                _id: info.user._id,
                role: true,
            }
            newClass.userList.push(user)
            newClass.save();
            const newGradeStructure = new GradeStructure({
                classID: newClass._id,
                gradeList: []
            })
            newGradeStructure.save();
            Users.findOneAndUpdate(
                { _id: info.user._id },
                {
                    $push: {
                        classList:
                        {
                            _id: newClass._id,
                            role: true
                        }
                    }
                },
                { safe: true, new: true }).exec()
            return {
                _id: newClass._id,
                className: newClass.className,
                classID: newClass.classID,
                desc: newClass.desc,
                userList: newClass.userList
            };
        }
    },

    async invited(info) {
        info = info || {};
        const currentUser = info.currentUser || {};
        const currentClass = info.currentClass || {};
        const email = info.email || "";
        const role = info.role || false;
        const classExist = Classes.find({ _id: currentClass })
        const isClassExist = await classExist.exec()
        if (isClassExist.length === 0) {
            return null;
        } else {
            const userExist = Users.find({ email: email })
            const isUserExist = await userExist.exec()
            if (isUserExist.length === 0) {

                const password = email + process.env.JWT_SECRET_KEY;
                const newUser = new Users({
                    userID: "",
                    email: email,
                    name: "",
                    password: password,
                    classList: [],
                });

                const cls = {
                    _id: currentClass,
                    role: role,
                }
                newUser.classList.push(cls)
                newUser.save();

                Classes.findOneAndUpdate(
                    { _id: currentClass },
                    {
                        $push: {
                            userList:
                            {
                                _id: newUser._id,
                                role: role
                            }
                        }
                    },
                    { safe: true, new: true }).exec()


            } else {
                Users.findOneAndUpdate(
                    { _id: isUserExist[0]._id },
                    {
                        $push: {
                            classList:
                            {
                                _id: currentClass,
                                role: role
                            }
                        }
                    },
                    { safe: true, new: true }).exec()

                Classes.findOneAndUpdate(
                    { _id: currentClass },
                    {
                        $push: {
                            userList:
                            {
                                _id: isUserExist[0]._id,
                                role: role
                            }
                        }
                    },
                    { safe: true, new: true }).exec()
            }


        }

        mailOptions.to = email;
        mailOptions.subject = 'BẠN ĐƯỢC MỜI THAM GIA MỘT LỚP HỌC';
        mailOptions.text = 'Người dùng ' + currentUser.name + ' (' + currentUser.email + ') đã mời bạn tham gia một lớp học. ' +
                            'Vui lòng sử dụng email ' + email + ' để đăng nhập vào hệ thống Grade Book và truy cập lớp học tại link sau: ' +
                            'http://localhost:3000/' + currentClass

        // Send email
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ');
            }
        });
    },

    async getGradeStructure(id) {
        let listGrade = [];
        let grade = [];
        const currentStructure = GradeStructure.find({ classId: id })
        const isCurrentStructure = await currentStructure.exec()
        if (isCurrentStructure === []) {
            listGrade = []
        } else {
            grade = isCurrentStructure[0].gradeList;
            for (var i = 0; i < grade.length; i++) {
                listGrade = listGrade.concat(grade[i]);
            }
        }

        return listGrade;
    }
}
