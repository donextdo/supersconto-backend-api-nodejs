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
    },
})

const ShopSchema = new mongoose.Schema({
    shop_name: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    address: {
        type: AddressSchema,
        required: true
    },

    shop_unique_id: { //shop name + shopaddress
        type: String,
        // required: true
    },
    
    owner_name: {
        type: String,
        // required: true
    },

    status: {
        type: Boolean,
        // required: true
    },

    logo_img: {
        type: String,
        // required: true
    },

    latitude: {
        type: Number,
        // required: true
    },

    longitude:  {
        type: Number,
        // required: true
    },

    shop_category: {
        type: String
    },

    is_online_selling: {
        type: Boolean,
    },

    telephone: {
        type: String,
    },

    isDelete: {
        type: Boolean,
        default: false
    }

}, {timestamps: true})

module.exports = mongoose.model("Shop", ShopSchema);