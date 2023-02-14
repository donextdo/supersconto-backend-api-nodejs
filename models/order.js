const mongoose = require('mongoose');

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

const OrderSchema = new mongoose.Schema({
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },

    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },

    phone: {
        type: String
    },

    billingAddress: {
        type: AddressSchema,
        required: true
    },

    orderItems: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'OrderItem'
        }
    ],

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


module.exports = mongoose.model("Order", OrderSchema);