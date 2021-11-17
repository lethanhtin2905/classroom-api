const mongoose = require("mongoose");
const SchemaTypes = mongoose.Schema.Types;

const usersSchema = new mongoose.Schema({
    username: String,
    userID: String,
    password: String,
    name: String,
    email: String,
    classList: [{
        _id: SchemaTypes.ObjectId,
        role: Boolean
    }]
}, { collection: "users" }, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

mongoose.model("Users", usersSchema);