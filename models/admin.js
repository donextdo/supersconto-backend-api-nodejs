const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const AdminSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },

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

    phone: {
        type: String,
        required: true,
    },

    userType: {
        type: Number,
        default: 0
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    isDelete: {
        type: Boolean,
        default: false
    },

}, {timestamps: true})

AdminSchema.methods.isValidPassword = async function (password) {
    const user = this;
    return await bcrypt.compare(password, user.password);
}

module.exports = mongoose.model("Admin", AdminSchema);