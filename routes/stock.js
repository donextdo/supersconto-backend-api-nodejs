const express = require('express')

const router = express.Router()

const { 
    getAllStocks,
    filterByShop,
    filterByCity,
    filterByVendor
 } = require('../controllers/stock')

router.get('/', getAllStocks)

router.get('/filter-by-vendor/:id', filterByVendor)

router.post('/filter-by-shop', filterByShop)

router.post('/filter-by-city', filterByCity)


module.exports = router