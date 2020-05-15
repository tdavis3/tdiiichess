const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true // All emails are different in the database
    },
    password: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    activity: {
        type: Number
    },
    admin: {
        type: Boolean
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = User = mongoose.model("User", UserSchema);
