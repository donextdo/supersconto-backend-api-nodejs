const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const CustomerSchema = new mongoose.Schema({
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
        default: 2
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

CustomerSchema.pre('save', async function (next) {
    if(!this.isModified('password')) {
        return next()
    }

    const hash = await bcrypt.hash(this.password, 10)

    this.password = hash

    next()
})

CustomerSchema.methods.isValidPassword = async function (password) {
    const user = this;
    return await bcrypt.compare(password, user.password);
}

module.exports = mongoose.model("Customer", CustomerSchema);