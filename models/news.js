const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
    },

    image: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },

    created_at: {
        type: Date,
        required: true
    },
    updated_at: {
        type: Date,
        required: true
    },
    expiredDate: {
        type: Date,
        required: true
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

module.exports = mongoose.model("News", NewsSchema);