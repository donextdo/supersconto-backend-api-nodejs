const mongoose = require('mongoose');

const CatelogBookPageSchema = new mongoose.Schema({
    shop_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },

    catelog_book_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CatelogBook',
        required: true
    },

    page_no: {
        type: Number,
        required: true,
    },

    page_setup_status: {
        type: Boolean,
        default: false
    },

    product_set_status: {
        type: Boolean,
        default: false
    },

    page_image: {
        type: String,
        required: true
    },

    isDelete: {
        type: Boolean,
        default: false
    },

    dimensions: {
        width: {
            type: Number,
            required: true
        },
        height: {
            type: Number,
            required: true
        }
    },

    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CatelogBookPageItem'
    }]

}, {timestamps: true})

module.exports = mongoose.model("CatelogBookPage", CatelogBookPageSchema);