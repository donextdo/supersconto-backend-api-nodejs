//not related to Superscronto - Sample

const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true
    },
    images:  {
        type: Array,
        required: true
    },
    categories: {
        type: Array
    },
    size: {
        type: String,
    },
    color: {
        type: String,
    },
    price: {
        type: Number,
        required: true
    },
    qty: {
        type: Number,
        default: 0
    },
    availability: {
        type: Boolean,
        default: true
    }
}, {timestamps: true})

module.exports = mongoose.model("Product", ProductSchema);