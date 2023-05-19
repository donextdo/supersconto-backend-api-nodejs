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
    },
      brand: {
        type: String,
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
      // category: [
      //   {
      //     type: mongoose.Schema.Types.ObjectId,
      //     ref: "Category",
      //   },
      // ],
    
      isAvailable: {
        type: Boolean,
        // required: true,
      },
      skuNumber: {
        type: String,
        // required: true,
      },
      type: {
        type: String,
        // required: true,
      },
      mfgDate: {
        type: String,
        // required: true,
      },
      expDate: {
        type: String,
        // required: true,
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

CatelogBookPageItemSchema.pre('save', function (next) {
    this.remaining_qty = this.quantity
    next()
})

module.exports = mongoose.model("CatelogBookPageItem", CatelogBookPageItemSchema);