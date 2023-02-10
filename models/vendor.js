const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const AddressSchema = new mongoose.Schema({
    address_line1: {
        type: String,
        required: true
    },

    address_line2: {
        type: String,
    },

    address_line3: {
        type: String,
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    postal_code: {
        type: String,
        required: true
    }
})

const VendorSchema = new mongoose.Schema({
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

    mobile: {
        type: String,
        required: true,
    },

    address: {
        type: AddressSchema,
        required: true
    },

    profilePic: {
        type: String,
    },

    userType: {
        type: Number,
        default: 0
    },

    isActive: {
        type: Boolean,
        default: true
    },

    isDelete: {
        type: Boolean,
        default: false
    },

    shopsList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop'
    }],

    newsList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'News'
    }]

}, {timestamps: true})


VendorSchema.pre('save', async function (next) {
    if(!this.isModified('password')) {
        return next()
    }

    const hash = await bcrypt.hash(this.password, 10)

    this.password = hash

    next()
})

VendorSchema.methods.isValidPassword = async function (password) {
    const user = this;
    return await bcrypt.compare(password, user.password);
}

module.exports = mongoose.model("Vendor", VendorSchema);