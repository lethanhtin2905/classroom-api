const mongoose = require("mongoose");
const SchemaTypes = mongoose.Schema.Types;

const usersSchema = new mongoose.Schema({
    userID: String,
    password: String,
    name: String,
    email: String,
}, { collection: "users" }, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

mongoose.model("Users", usersSchema);