const mongoose = require('mongoose');

const CatelogBookPageItemSchema = new mongoose.Schema({
    
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

    catelog_page_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CatelogBookPage',
        required: true
    },

    product_name: {
        type: String,
        required: true,
    },

    product_category: {
        type: String,
        // required: true
    },
    
    product_description: {
        type: String,
       
    },

    item_index: {
        type: Number,
        // required: true
    },

    crop_id: {
        type: Number,
        // required: true
    },

    quantity: {
        type: Number,
        // required: true
    },

    remaining_qty: {
        type: Number
    },

    unit_price: {
        type: Number,
        required: true
    },

    product_image: { //croped image
        type: String,
        required: true
    },

    isOnlineSale_available: { 
        type: Boolean,
        default: false
    },

    isDelete: {
        type: Boolean,
        default: false
    },

    status: {
        type: Boolean,
        default: false
    },
    coordinates: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }

}, {timestamps: true})

CatelogBookPageItemSchema.pre('save', function (next) {
    this.remaining_qty = this.quantity
    next()
})

module.exports = mongoose.model("CatelogBookPageItem", CatelogBookPageItemSchema);