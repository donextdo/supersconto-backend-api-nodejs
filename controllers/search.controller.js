const Shop = require('../models/shop')
const CatelogBookPageItem = require('../models/catalog_page_item')



const searchProducts = async (req, res) => {
    try {
        const query = req.body.query

        const shops = await Shop.find({
            shop_name: { $regex : `${query}`, $options : 'i'}
        })

        const products = await CatelogBookPageItem.find({
            product_name: { $regex : `${query}`, $options : 'i' }
        })

        res.status(200).json({
            shops: shops,
            products: products
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

module.exports = {
    searchProducts
}