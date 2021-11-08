const mongoose = require("mongoose");
const SchemaTypes = mongoose.Schema.Types;

const usersSchema = new mongoose.Schema({
    userID: String,
    username: String,
    password: String,
    name: String,
    email: String,
    role: String,
    googleID: String,
    facebookID: String,
}, { collection: "users" }, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

mongoose.model("Users", usersSchema);