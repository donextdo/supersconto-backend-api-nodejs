const mongoose = require('mongoose');

const ProductCategorySchema = new mongoose.Schema({
    main_category: {
        type: String,
        required: true,
        unique: true
    },

    sub_category_1: {
        type: String,
    },
    sub_category_2: {
        type: String,
    },

    sub_category_3: {
        type: String,
    },

    sub_category_4: {
        type: String,
    },


    
    image: {
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
    isDelete: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

module.exports = mongoose.model("ProductCategory", ProductCategorySchema);