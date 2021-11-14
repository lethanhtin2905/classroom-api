const mongoose = require('mongoose');
const constant = require('../../Utils/constant');
const Classes = mongoose.model('Classes');
const Users = mongoose.model('Users')

module.exports = {
    getAllClasses(query, option) {
        query = query || {};
        option = option || {};
        const allClass = Classes.find(query)
        return allClass.exec();
    },
    addClass(info) {
        info = info || {};
        info.className = info.className || "";
        info.classID = info.classID || "";
        info.desc = info.desc || "";
        info.user = info.user || {};
        info.userList = info.userList || [];
        Classes.findOne({ classID: info.classID })
            .then(cls => {
                if (cls) {
                    console.log('môn học đã tồn tại' + err);
                } else {
                    const newClass = new Classes({
                        className: info.className,
                        classID: info.classID,
                        desc: info.desc,
                        userList: info.userList
                    });
                    newClass.userList.push(info.user)
                    newClass.save();
                    Users.findOneAndUpdate(
                        { email: info.user.email },
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

                }
            }
            )


        // function (error, success) {
        //     if (error) {
        //         console.log('error');
        //     } else {
        //         console.log('success');
        //     }
        // })
        //  Users.findOneAndUpdate({ _id: info.user._id }, { $push: { classList: { _id: newClass._id, role: true } } }, { safe: true, new: true })

    },
}
