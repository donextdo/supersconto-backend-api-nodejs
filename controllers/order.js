const Order = require('../models/order')
const OrderItem = require('../models/order_items')
const CatelogBookPageItem = require('../models/catalog_page_item')
const Customer = require('../models/customer')

const createOrder = async (req, res, next) => {
    try {

        const {
            shop,
            customer,
            phone,
            billingAddress,
            orderItems,
            payementMethod
        } = req.body

        let grandTotal = 0
        const processedOrderItems = []

        for(item of orderItems) {
            const pageitem = await CatelogBookPageItem.findById(item.item_id)

            if(pageitem.remaining_qty < item.qty) {
                return res.status(400).json({
                    success: false,
                    message: `Cannot complete order. orders quantity is larger than available quantity for product ${pageitem.product_name}`
                })
            }

            const totalPrice = pageitem.unit_price * item.qty

            const orderItemDto = {
                product: pageitem._id,
                unitPrice: pageitem.unit_price,
                qty: item.qty,
                totalPrice
            }

            processedOrderItems.push(orderItemDto)
        }

        grandTotal = processedOrderItems.reduce((acc, product) => acc + product.totalPrice, 0)

        for(item of processedOrderItems) {

            await CatelogBookPageItem.findByIdAndUpdate(
                item.product,
                {
                    $inc: {
                        remaining_qty: -item.qty
                    }
                },
                {
                    new: true,
                    runValidators: true
                }
            )
        }

        let address = billingAddress

        if(req.body.useCustomerAdress) {
            const customerInfo = await Customer.findById(customer)

            address = customer.address
        }

        const newOrder = new Order({
            shop,
            customer,
            phone,
            billingAddress: address,
            totalPrice: grandTotal,
            payementMethod
        })

        const order = await newOrder.save()

        console.log(order._id)

        const newOrderItems = processedOrderItems.map(item => {
            return {
                orderId: order._id,
                ...item
            }
        })

        const orderItemsRes = await OrderItem.create(newOrderItems)

        res.status(201).json({
            success: true,
            order,
            orderItemsRes
        })

    }
    catch (error) {
        res.status(500).json(error.message)
    }
}


const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().populate({
            path: 'shop',
            select: ['shop_name', 'address']
        })
        .populate({
            path: 'customer',
            select: ['fullName']
        })

        res.status(200).json(orders)
    }
    catch (error) {
        res.status(500).json(error.message)
    }
}


const getOrdersByShop = async (req, res, next) => {
    try {
        const shop = req.body.shop

        const orders = await Order.find({
            shop
        }).populate({
            path: 'shop',
            select: ['shop_name', 'address']
        })
        .populate({
            path: 'customer',
            select: ['fullName']
        })

        res.status(200).json(orders)
    }
    catch (error) {
        res.status(500).json(error.message)
    }
}


const getAllOrderItems = async (req, res, next) => {
    try {
        const orderItems = await OrderItem.find().populate({
            path: 'product',
            select: ['product_name', 'product_category', 'product_image']
        })

        res.status(200).json(orderItems)
    }
    catch (error) {
        res.status(500).json(error.message)
    }
}


const getOrderItemsByOrder = async (req, res, next) => {
    try {
        const orderId = req.body.orderId

        const orderItems = await OrderItem.find({
            orderId
        }).populate({
            path: 'product',
            select: ['product_name', 'product_category', 'product_image']
        })

        res.status(200).json(orderItems)
    }
    catch (error) {
        res.status(500).json(error.message)
    }
}

module.exports = {
    createOrder,
    getAllOrders,
    getOrdersByShop,
    getAllOrderItems,
    getOrderItemsByOrder
}