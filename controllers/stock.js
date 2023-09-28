const CatelogBookPageItem = require('../models/catalog_page_item')
const Shop = require("../models/shop");


const getAllStocks = async (req, res, next) => {
    try {
        const stocks = await CatelogBookPageItem.find().populate({
            path: 'shop_id',
            select: ['shop_name', 'address', 'logo_img']
        })

        res.status(200).json(stocks)
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server error" });
    }
}


const filterByShop = async (req, res, next) => {
    try {
        const shop = req.body.shop

        const stocks = await CatelogBookPageItem.find(
            {shop_id: shop}
        ).populate({
            path: 'shop_id',
            select: ['shop_name', 'address', 'logo_img']
        })

        res.status(200).json(stocks)
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server error" });
    }
}

const filterByVendor = async (req, res, next) => {
    try {
        const shops = await Shop.find({vendor:req.params.id}).lean()
        const stocks = await CatelogBookPageItem.find({ shop_id: { $in: shops.map(a => a._id) } }).populate({
            path: 'shop_id',
            select: ['shop_name', 'address', 'logo_img']
        })

        res.status(200).json(stocks)
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server error" });
    }
}

const filterByCity = async (req, res, next) => {
    try {
        const city = req.body.city

        const stocks = await CatelogBookPageItem.find()
        .populate({
            path: 'shop_id',
            match: { 'address.city' : city }
        })

        res.status(200).json(stocks)
    }
    catch(error) {
        res.status(500).json({ message: "Internal Server error" });
    }
}


module.exports = {
    getAllStocks,
    filterByShop,
    filterByCity,
    filterByVendor
}



// I have this two models in mongodb

// const shopSchema = mongoose.Schema({
//     shopName: {
//         type: String,
//         requried: true,
//     },

//     address_Line1: String,
//     address_line2: string,
//     city: string
// })


// const product = mongoose.Schema({
//     product_name: Stirng,

//     shop: {
//         mongoose.Schema.Types.ObjectId,
//         ref: 'Shop'
//     }
// })

// shop may have multiple products and same product can sell by shops. i want get products by given shop city. for an example if i provide city x need retriew all products that their shop have city x