const mongoose = require("mongoose");
const SchemaTypes = mongoose.Schema.Types;

// Classes
const classesSchema = new mongoose.Schema({
    className: String,
    classID: String,
    desc: String,
    teacher: String,
}, { collection: "classes" }, { toJSON: { virtuals: true }, toObject: { virtuals: true }});

mongoose.model("Classes", classesSchema);