const Order = require("../models/neworder");
const { request } = require("express");
const Product = require("../models/product");
const Catalog_page_item = require("../models/catalog_page_item");
const axios = require("axios");
const CatelogBookPageItem = require("../models/catalog_page_item");
const sendEmail = require("../config/nodemailer/nodemailer");
let ORDERCURRENTBRAND = "BT";
let ORDERCURRENTAMOUNT = 1000;

const createOrder = async (req, res) => {
  const userId = req.body.userId;
  const items = req.body.items;
  const billingAddress = req.body.billingAddress;
  const shippingAddress = req.body.shippingAddress;
  const date = req.body.date;
  const totalprice = req.body.totalprice;
  const status = req.body.status;
  const createdAt = new Date();
  const deletedAt = null;

  try {
    
    const count = await Order.countDocuments()
    const orderNumber =
      ORDERCURRENTBRAND + (parseInt(ORDERCURRENTAMOUNT) + (count + 1));

    try {
      const products = req.body.items;

      // Loop through each product
      for (const product of products) {
        const { productId, orderquantity } = product;

        const catalogBookPageItem = await CatelogBookPageItem.findById(
          productId
        );

        if (!catalogBookPageItem) {
          return res
            .status(404)
            .json({
              message: `No CatelogBook with ID ${catalogBookPageItem.product_name}`,
            });
        }

        if (orderquantity > catalogBookPageItem.remaining_qty) {
          return res.status(400).json({
            message: `Insufficient quantity for product with ID ${catalogBookPageItem.product_name}`,
          });
        }
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Error checking product quantities" });
    }

    let response = await Order.create({
      orderNumber,
      userId,
      items,
      billingAddress,
      shippingAddress,
      date,
      totalprice,
      status,
      createdAt,
      deletedAt,
    });

    if (response) {
      // Update product catalog item quantities
      try {
        const products = req.body.items;

        // Loop through each product
        for (const product of products) {
          const { productId, orderquantity } = product;

          const catelogBookPageItemExist = await CatelogBookPageItem.findById(
            productId
          );

          if (!catelogBookPageItemExist) {
            return res
              .status(404)
              .json({
                message: `No CatelogBook with ID ${catelogBookPageItemExist.product_name}`,
              });
          }

          const remainingItem =
            catelogBookPageItemExist.remaining_qty - orderquantity;
          console.log(remainingItem)
          // Update the CatelogBookPageItem with the new remaining item value
          await CatelogBookPageItem.findByIdAndUpdate(
            productId,
            { remaining_qty: remainingItem },
            { new: true, runValidators: true }
          );
        }

        res.status(201).send({
          orderNumber: response.orderNumber,
          message: "Order Successful",
        });
      } catch (error) {
        console.log(error);
        res
          .status(404)
          .json({ message: "Error updating product catalog item quantities" });
      }
    } else {
      return res.status(500).send({ message: "Internal server error" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error while placing Order" });
  }
};

//get all orders
const getAllOrders = async (req, res) => {
  try {
    let orders = await Order.find();
    if (orders) {
      return res.json(orders);
    } else {
      return res
        .status(404)
        .send({ message: "Error occured when retrieving orders" });
    }
  } catch (err) {
    return res.status(500).send({ message: "Internal server error" });
  }
};

//get order by id
const getOrderByOrderId = async (req, res) => {
  const orderId = req.params.id;

  try {
    let response = await Order.findById(orderId);

    if (response) {
      return res.json(response);
    } else {
      return res.status(404).send({ message: "No such order found" });
    }
  } catch (err) {
    return res.status(404).send({ message: "No such order found" });
  }
};

//update order by id

const updateOrder = async (req, res) => {
  const Id = req.params.id;

  let orderUpdate = {
    status: req.body.status,
  };

  try {
    const response = await Order.findOneAndUpdate({ _id: Id }, orderUpdate);

    if (response) {
      return res.status(200).send({ message: "Successfully updated Order" });
    } else {
      return res.status(500).send({ message: "Internal server error" });
    }
  } catch (err) {
    return res.status(400).send({ message: "Unable to update" });
  }
};
//delete order by id
const deleteOrder = async (req, res) => {
  const Id = req.params.id;
  try {
    const response = await Order.findByIdAndDelete({ _id: Id });
    if (response) {
      return res.status(204).send({ message: "Successfully deleted a Order" });
    } else {
      return res.status(500).send({ message: "Internal server error" });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(400).send({ message: "Could not delete the request" });
  }
};

const getOrderByUser = async (req, res) => {
  const userId = req.params.userId;
  console.log("user Id", userId);
  try {
    const orders = await Order.find({ userId: userId });

    const orderDetails = [];

    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      console.log("order", order);

      const productIds = [
        ...new Set(order.items.map((item) => item.productId)),
      ];

      const products = await Catalog_page_item.find({
        _id: { $in: productIds },
      });

      const productMap = {};
      products.forEach((product) => {
        productMap[product._id] = {
          shopId: product.shop_id,
          name: product.product_name,
          brand: product.brand,
          description: product.description,
          price: product.unit_price,
          front: product.product_image,
        };
      });

      const itemDetails = [];

      for (let j = 0; j < order.items.length; j++) {
        const item = order.items[j];

        itemDetails.push({
          productId: item.productId,
          orderquantity: item.orderquantity,
          productDetails: productMap[item.productId],
          shopId: item.shopId,
        });
      }

      orderDetails.push({
        orderNumber: order.orderNumber,
        orderId: order._id,
        userId: order.userId,
        items: itemDetails,
        billingAddress: order.billingAddress,
        shippingAddress: order.shippingAddress,
        date: order.date,
        totalprice: order.totalprice,
        status: order.status,
        createdAt: order.createdAt,
        deletedAt: order.deletedAt,
      });
    }

    res.json(orderDetails);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};


const getOrderById = async (req, res) => {
  const orderId = req.params.id;
  
  try {
    const order = await Order.findOne({ orderNumber: orderId }); // use findOne instead of find, and search by _id instead of orderId
    console.log(order);
    const productIds = order.items.map((item) => item.productId); // no need to use Set here
    console.log({ productIds });
   
    const products = await Catalog_page_item.find({ _id: { $in: productIds } });

    const productMap = {};
    products.forEach((product) => {
      productMap[product._id] = {
        shopId: product.shop_id,
        name: product.product_name,
        brand: product.brand,
        description: product.description,
        price: product.unit_price,
        front: product.product_image,
      };
    });

    const itemDetails = [];
    for (let j = 0; j < order.items.length; j++) {
      const item = order.items[j];

      itemDetails.push({
        productId: item.productId,
        orderquantity: item.orderquantity,
        productDetails: productMap[item.productId],
        shopId: item.shopId,
      });
    }

    const orderDetails = {
      // initialize orderDetails as an object instead of an array
      orderNumber: order.orderNumber,
      orderId: order._id,
      userId: order.userId,
      items: itemDetails,
      billingAddress: order.billingAddress,
      shippingAddress: order.shippingAddress,
      date: order.date,
      totalprice: order.totalprice,
      status: order.status,
      createdAt: order.createdAt,
      deletedAt: order.deletedAt,
      address: order.address,
      payment: order.payment,
    };

    res.json(orderDetails);
  } catch (error) {
    console.error(error);
    res.status(500).send("order ID incorrect");
  }
};

const emailCartItems = async (req, res, next) => {
  const {originalname, buffer} = req.file;

  const mailOptions = {
    to: req.body.email,
    subject: 'Shopping List PDF',
    text: 'Attached is the shopping list PDF.',
    attachments: [
      {
        filename: originalname,
        content: buffer,
      },
    ],
  };

  sendEmail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({error: 'Failed to send email'});
    } else {
      console.log('Email sent:', info.response);
      res.json({message: 'Email sent successfully'});
    }

  })
}

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrderByUser,
  emailCartItems
};
