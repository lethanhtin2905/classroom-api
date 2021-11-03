const Class = require('./classesService');

/* GET all classes. */
const classes = async (req, res, next) => {
    let classes = await Class.getAllClasses();
    const result = classes.map((cls, index) => {
        return {
            _id: cls._id,
            className: cls.className,
            classID: cls.classID,
            desc: cls.desc,
            teacher: cls.teacher
        }
    })
    res.json(result);
};

// add class
const addClass = async (req, res, next) => {
    try {
        if (!req.body) {
            res.json({
                isSuccess: false,
                message: "Fail"
            })
        } else {
            const newClass = Class.addClass({
                className: req.body.className,
                classID: req.body.classID,
                desc: req.body.desc,
                teacher: req.body.teacher
            });

            res.json({
                isSuccess: true,
                message: "Success"
            })
        }
    } catch (error) {
        res.json({
            isSuccess: false,
            message: "Fail"
        })
    }
};

module.exports = {
    classes,
    addClass
};