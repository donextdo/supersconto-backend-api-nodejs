const express = require("express");

const router = express.Router();
const multer = require("multer");
const upload = multer({storage: multer.memoryStorage()});

let orderController = require("../controllers/neworder");

router.post("/place", orderController.createOrder);
router.get("/", orderController.getAllOrders);
router.get("/:id", orderController.getOrderById);
router.put("/:id", orderController.updateOrder);
router.delete("/:id", orderController.deleteOrder);
router.get("/get/:userId", orderController.getOrderByUser);
router.post('/send-email', upload.single('pdf'), orderController.emailCartItems);


module.exports = router;
