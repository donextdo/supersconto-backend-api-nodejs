const express = require('express')

const {
    searchProducts
} = require('../controllers/search.controller')

const router = express.Router()


router.post('/', searchProducts)


module.exports = router