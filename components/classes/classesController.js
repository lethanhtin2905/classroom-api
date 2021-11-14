const Class = require('./classesService');

/* GET all classes. */
const classes = async (req, res, next) => {
    let classes = await Class.getAllClasses();
    const result = classes.map((cls, index) => {
        return {
            _id: cls._id,
            className: cls.className,
            classID: cls.classID,
            desc: cls.desc
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
                message: "Fail1"
            })
        } else {
            const newClass = Class.addClass({
                className: req.body.className,
                classID: req.body.classID,
                desc: req.body.desc,
                user: req.body.user
            });

            res.json({
                isSuccess: true,
                message: "Success"
            })
        }
    } catch (error) {
        res.json({
            isSuccess: false,
            message: "Fail2"
        })
    }
};

module.exports = {
    classes,
    addClass
};