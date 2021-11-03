const mongoose = require('mongoose');
const constant = require('../../Utils/constant');
const Classes = mongoose.model('Classes');

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
        info.teacher = info.teacher || "";
        Classes.findOne({ classID: info.classID })
            .then(cls => {
                if (cls) {
                    console.log('môn học đã tồn tại' + err);
                } else {
                    const newClass = new Classes({
                        className: info.className,
                        classID: info.classID,
                        teacher: info.teacher,
                        desc: info.desc,
                    });
                    newClass.save();
                }
            },
            )
    },
}
