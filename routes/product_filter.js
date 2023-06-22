const express = require("express");
const router = express.Router();

const { getproductByfilter } = require("../controllers/product_filter");

router.get("/", getproductByfilter);

module.exports = router;
