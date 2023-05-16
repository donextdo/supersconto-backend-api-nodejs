const express = require("express");

const router = express.Router();

let orderController = require("../controllers/neworder");

router.post("/place", orderController.createOrder);
router.get("/", orderController.getAllOrders);
router.get("/:id", orderController.getOrderById);
router.put("/:id", orderController.updateOrder);
router.delete("/:id", orderController.deleteOrder);
router.get("/get/:userId", orderController.getOrderByUser);

module.exports = router;
