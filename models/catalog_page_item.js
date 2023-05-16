const mongoose = require('mongoose');

const CatelogBookPageItemSchema = new mongoose.Schema({
    
    // shop_id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Shop',
    //     // required: true
    // },
    
    // catelog_book_id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'CatelogBook',
    //     // required: true
    // },

    catelog_page_id: {
        type: String,
        // ref: 'CatelogBookPage',
        // required: true
    },

    product_name: {
        type: String,
        required: true,
    },

    product_category: {
        type: String,
       
    },
    
    product_description: {
        type: String,
       
    },

    item_index: {
        type: Number,
        
    },

    crop_id: {
        type: Number,
        
    },

    quantity: {
        type: Number,
        
    },

    remaining_qty: {
        type: Number
    },

    unit_price: {
        type: Number,
        // required: true
    },

    product_image: { //croped image
        type: String,
        // required: true
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