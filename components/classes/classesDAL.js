const mongoose = require("mongoose");
const SchemaTypes = mongoose.Schema.Types;

// Classes
const classesSchema = new mongoose.Schema({
    className: String,
    classID: String,
    desc: String,
    createBy: {
        _id: SchemaTypes.ObjectId,
        name: String,
        email: String
    },
    userList: [{
        _id: SchemaTypes.ObjectId,
        role: Boolean
    }],
}, { collection: "classes" }, { toJSON: { virtuals: true }, toObject: { virtuals: true }});

mongoose.model("Classes", classesSchema);