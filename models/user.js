const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password :  {
        type: String,
        required: true
    },

    firstName: {
        type: String,
    },

    lastName: {
        type: String,
    },

    isAdmin: {
        type: Boolean,
        default: false
    },

    userType: {
        type: Number,
        default: 0
    }, 
    isDelete: {
        type: Boolean,
        default: false
    }

}, {timestamps: true})

module.exports = mongoose.model("User", UserSchema);