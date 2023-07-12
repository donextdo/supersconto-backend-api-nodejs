const express = require('express')

const router = express.Router()
const {
    createOrder,
    getAllOrders,
    getOrdersByShop,
    getAllOrderItems,
    getOrderItemsByOrder,
    getOrdersByShopId
} = require('../controllers/order')


router.post('/', createOrder)

router.get('/', getAllOrders)

router.post('/by-shop', getOrdersByShop)

router.get('/order-items', getAllOrderItems)

router.post('/order-items/by-order', getOrderItemsByOrder)

router.get('/shops/:shopId/orders', getOrdersByShopId)


module.exports = router