const mongoose = require('mongoose');
const Order = require('./order')

const orderItemsSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CatelogBookPageItem',
        required: true
    },
    unitPrice: {
        type: Number
    },
    qty: {
        type: Number
    },
    totalPrice: {
        type: Number
    }
})

orderItemsSchema.post('save', async (doc) => {
    await Order.findOneAndUpdate({
        _id: doc.orderId
    },
    {
        $push: {orderItems: doc._id}
    })
})


module.exports = mongoose.model("OrderItem", orderItemsSchema);