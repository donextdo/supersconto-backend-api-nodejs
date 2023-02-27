const mongoose = require('mongoose');


const ShopOrderSchema = new mongoose.Schema({

    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },

    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },

    totalPrice: {
        type: Number,
        required: true
    },

    paymentMethod: {
        type: String,
    },

    status: {
        type: Number,
        default: 0
    }


}, {timestamps: true})


module.exports = mongoose.model("ShopOrder", ShopOrderSchema);