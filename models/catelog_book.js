const mongoose = require('mongoose');

const CatelogBookSchema = new mongoose.Schema({
    shop_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },

    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
    },

    expiredate: {
        type: Date,
        required: true
    },

    startdate: {
        type: Date,
        
    },

    status: {
        type: Number,
        default: 0
    },

    special_level: {
        type: Number,
        // required: true
    },

    isDelete: {
        type: Boolean,
        default: false
    },
    flyer: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: false
    },
    pages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CatelogBookPage'
    }]

}, {timestamps: true})

module.exports = mongoose.model("CatelogBook", CatelogBookSchema);