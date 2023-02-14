const express = require('express')

const router = express.Router()

const {
    createOrder,
    getAllOrders,
    getOrdersByShop,
    getAllOrderItems,
    getOrderItemsByOrder
} = require('../controllers/order')

router.post('/', createOrder)

router.get('/', getAllOrders)

router.post('/by-shop', getOrdersByShop)

router.get('/order-items', getAllOrderItems)

router.post('/order-items/by-order', getOrderItemsByOrder)

module.exports = router