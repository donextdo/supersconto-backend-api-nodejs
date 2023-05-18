const Order = require("../models/order");
const OrderItem = require("../models/order_items");
const CatelogBookPageItem = require("../models/catalog_page_item");
const Customer = require("../models/customer");

// const createOrder = async (req, res, next) => {
//     try {

//         const {
//             fullName,
//             phone,
//             billingAddress,
//             orderItems,
//             payementMethod
//         } = req.body

//         let grandTotal = 0
//         const processedOrderItems = []

//         for(item of orderItems) {
//             const pageitem = await CatelogBookPageItem.findById(item.item_id)

//             if(pageitem.remaining_qty < item.qty) {
//                 return res.status(400).json({
//                     success: false,
//                     message: `Cannot complete order. orders quantity is larger than available quantity for product ${pageitem.product_name}`
//                 })
//             }

//             const totalPrice = pageitem.unit_price * item.qty

//             const orderItemDto = {
//                 shop_id: pageitem.shop_id,
//                 product: pageitem._id,
//                 unitPrice: pageitem.unit_price,
//                 qty: item.qty,
//                 totalPrice
//             }

//             processedOrderItems.push(orderItemDto)
//         }

//         grandTotal = processedOrderItems.reduce((acc, product) => acc + product.totalPrice, 0)

//         const itemsByShop = processedOrderItems.reduce((acc, item) => {
//             const shop = item.shop_id;
//             if (!acc[shop]) {
//               acc[shop] = [];
//             }
//             acc[category].push(item);
//             return acc;
//         }, {})

//         for(item of processedOrderItems) {

//             await CatelogBookPageItem.findByIdAndUpdate(
//                 item.product,
//                 {
//                     $inc: {
//                         remaining_qty: -item.qty
//                     }
//                 },
//                 {
//                     new: true,
//                     runValidators: true
//                 }
//             )
//         }

//         let address = billingAddress

//         if(req.body.useCustomerAdress) {
//             const customerInfo = await Customer.findById(customer)

//             address = customer.address
//         }

//         const newOrder = new Order({
//             shop,
//             customer,
//             phone,
//             billingAddress: address,
//             totalPrice: grandTotal,
//             payementMethod
//         })

//         const order = await newOrder.save()

//         console.log(order._id)

//         const newOrderItems = processedOrderItems.map(item => {
//             return {
//                 orderId: order._id,
//                 ...item
//             }
//         })

//         const orderItemsRes = await OrderItem.create(newOrderItems)

//         res.status(201).json({
//             success: true,
//             order,
//             orderItemsRes
//         })

//     }
//     catch (error) {
//         res.status(500).json(error.message)
//     }
// }

const createOrder = async (req, res, next) => {
  try {
    const { fullName, phone, billingAddress, orderItems, payementMethod } =
      req.body;

    let grandTotal = 0;
    const processedOrderItems = [];

    for (const item of orderItems) {
      const pageitem = await CatelogBookPageItem.findById(item._id);

      console.log(typeof pageitem.remaining_qty);
      console.log(item.quantity);

      if (parseInt(pageitem.remaining_qty) < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Cannot complete order. orders quantity is larger than available quantity for product ${pageitem.product_name}`,
        });
      }

      const totalPrice = pageitem.unit_price * item.quantity;

      const orderItemDto = {
        shopId: pageitem.shop_id,
        product: pageitem._id,
        unitPrice: pageitem.unit_price,
        qty: item.quantity,
        totalPrice,
      };

      processedOrderItems.push(orderItemDto);
    }

    console.log("====");

    grandTotal = processedOrderItems.reduce(
      (acc, product) => acc + product.totalPrice,
      0
    );

    for (const item of processedOrderItems) {
      await CatelogBookPageItem.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            remaining_qty: -item.qty,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );
    }

    const newOrder = new Order({
      full_name: fullName,
      phone,
      billingAddress: billingAddress,
      totalPrice: grandTotal,
      payementMethod,
    });

    const order = await newOrder.save();

    console.log(order._id);

    const newOrderItems = processedOrderItems.map((item) => {
      return {
        orderId: order._id,
        ...item,
      };
    });

    const orderItemsRes = await OrderItem.create(newOrderItems);

    res.status(201).json({
      success: true,
      order,
      orderItemsRes,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    // const orders = await Order.find().populate({
    //     path: 'shop',
    //     select: ['shop_name', 'address']
    // })
    // .populate({
    //     path: 'customer',
    //     select: ['fullName']
    // })

    const orders = await Order.find();

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

const getAllOrderItems = async (req, res, next) => {
  try {
    const orderItems = await OrderItem.find().populate({
      path: "product",
      select: ["product_name", "product_category", "product_image"],
    });

    res.status(200).json(orderItems);
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

const getOrderItemsByOrder = async (req, res, next) => {
  try {
    const orderId = req.body.orderId;

    const orderItems = await OrderItem.find({
      orderId,
    }).populate({
      path: "product",
      select: ["product_name", "product_category", "product_image"],
    });

    res.status(200).json(orderItems);
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

const getOrdersByShop = async (req, res, next) => {
  try {
    const shopId = req.params.shopId;

    const orders = await Order.find({
      shop: shopId,
    })
      .populate({
        path: "shop",
        select: ["shop_name", "address"],
      })
      .populate({
        path: "customer",
        select: ["fullName"],
      });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

//Added for Filter shopId from orderId
const getOrdersByShopId = async (req, res, next) => {
  try {
    const shopId = req.params.shopId;

    const orders = await Order.find({
      shop: shopId,
    }).populate({
      path: "shop",
      select: ["shop_name", "address"],
    });
    // .populate({
    //     path: 'customer',
    //     select: ['fullName']
    // })

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrdersByShop,
  getAllOrderItems,
  getOrderItemsByOrder,
  getOrdersByShopId,
};
