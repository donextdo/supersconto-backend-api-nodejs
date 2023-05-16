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
    },
    brand: {
        type: String,
      },
      description: {
        type: String,
        required: true,
      },
    
      front: {
        type: String,
      },
      side: {
        type: String,
      },
      back: {
        type: String,
      },
      category: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
        },
      ],
      isAvailable: {
        type: Boolean,
        
      },
      skuNumber: {
        type: String,
        
      },
      type: {
        type: String,
       
      },
      mfgDate: {
        type: String,
       
      },
      expDate: {
        type: String,
       
      },
      discount: {
        type: Number,
      },
      review: {
        type: Number,
      },
    
      soldCount: {
        type: Number,
      },
    
      popularity: {
        type: Number,
      },
    
      averageRating: {},
    
      additionalInformation: [],
    
      tags: [],
    
      updatedAt: {
        type: Date,
        default: null,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      deletedAt: {
        type: Date,
        default: null,
      },
      life: {
        type: String,
      },
}, {timestamps: true})

module.exports = mongoose.model("Product", ProductSchema);