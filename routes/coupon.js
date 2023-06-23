const express = require("express");

const router = express.Router();

let couponController = require("../controllers/coupon");

router.post("/insert", couponController.addCoupon);
router.get("/getAll/", couponController.getAllCoupen);
router.get("/getOne/:coupon_code", couponController.getCouponById);
router.put("/:id", couponController.updateCoupen);
router.delete("/:id", couponController.deleteCoupen);

module.exports = router;
