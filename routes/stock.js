const express = require('express')

const router = express.Router()

const { 
    getAllStocks,
    filterByShop,
    filterByCity
 } = require('../controllers/stock')

router.get('/', getAllStocks)

router.post('/filter-by-shop', filterByShop)

router.post('/filter-by-city', filterByCity)


module.exports = router