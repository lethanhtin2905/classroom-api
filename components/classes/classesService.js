const mongoose = require('mongoose');
const constant = require('../../Utils/constant');
const Classes = mongoose.model('Classes');
const Users = mongoose.model('Users')

module.exports = {
    async getAllClasses(query, option) {
        query = query || {};
        option = option || {};

        const allClass = Classes.find(query)
        const a = await allClass.exec()
        return a;
    },
    async getClassById(id) {

        const cls = Classes.findOne({_id: id})
        const c = await cls.exec()
        return c;
    },
    
    async getMyClasses(query, option, infoUser) {
        query = query || {};
        option = option || {};
        let myClasses = [];   
        let listClass = [];   
        const currentUser = Users.find({_id: infoUser._id})
        const isCurrentUser = await currentUser.exec()
        if (isCurrentUser===[]){
            myClasses = []
        } else {
            myClasses = isCurrentUser[0].classList;
            for (var i = 0; i < myClasses.length; i++) {
                const class_i = Classes.find({_id: myClasses[i]._id});
                const cls_i = await class_i.exec();
                listClass = listClass.concat(cls_i);
            }
        }
        
        return listClass;
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
        if (isClassExist.length!==0) {
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
}
