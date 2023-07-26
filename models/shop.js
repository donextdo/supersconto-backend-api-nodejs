const mongoose = require("mongoose");
const GeoSchema = require("./geo_schema");
const {Schema} = require("mongoose");

const AddressSchema = new mongoose.Schema({
    address: {
        type: String,
        //required: true,
    },

    // address_line2: {
    //   type: String,
    // },

    // address_line3: {
    //   type: String,
    // },
    state: {
        type: String,
        //required: true,
    },
    // city: {
    //   type: String,
    //   required: true,
    // },
    postal_code: {
        type: String,
        //required: true,
    },
    // geometry: {
    //     type: GeoSchema
    // },
});

const ShopSchema = new mongoose.Schema(
    {
        shop_name: {
            type: String,
            // required: true,
        },
        customized_shop_name: {
            type: String,    
        },
        website: {
            type: String,     
        },
        city: {
            type: String,     
        },

        vendor: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: 'role'
        },

        role: {
            type: String,
            required: true,
            enum: ['Admin', 'Vendor']
        },

        description: {
            type: String,
            //required: true,
        },

        address: {
            type: AddressSchema,

            //required: true
        },

        shop_unique_id: {
            //shop name + shopaddress
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

        longitude: {
            type: Number,
            // required: true
        },

        shop_category: {
            type: String,
        },

        is_online_selling: {
            type: Boolean,
        },

        telephone: {
            type: String,
        },

        isDelete: {
            type: Boolean,
            default: false,
        },
        coordinates: {
            type: [Number],
            index: "2dsphere",
        },
        catelog_books: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "CatelogBook",
            },
        ],
    },
    {timestamps: true}
);

module.exports = mongoose.model("Shop", ShopSchema);
