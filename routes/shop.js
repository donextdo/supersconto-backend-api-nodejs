const express = require("express");
const multer = require("multer");
const storage = require("../middleware/multerStorage");

const {
  getAllShops,
  createShop,
  getShop,
  updateShop,
  deleteShop,
  countDocuments,
  getShopByVendor,
  getAllShopsParams,
  getShopByVendorParms,
  getCheckName,
  getFilters,
  applyFilter
} = require("../controllers/shop");
const {AuthenticatedVendorMiddleware} = require("../middleware/authentication");

const uploadOptions = multer({ storage: storage });

const router = express.Router();

router.get("/", getAllShops);

router.get("/allshops", getAllShopsParams);


router.get("/find/:id", getShop);

router.get("/by-vendor/:id", AuthenticatedVendorMiddleware, getShopByVendor);

router.get("/by-vendor-params/:id", AuthenticatedVendorMiddleware, getShopByVendorParms);


router.post("/", uploadOptions.single("logo_img"), createShop);

router.post("/check-name", uploadOptions.single("logo_img"), getCheckName);


router.patch("/:id", uploadOptions.single("logo_img"), updateShop);

router.delete("/:id", deleteShop);

router.get("/count", countDocuments);

router.get("/filters", getFilters)

router.post("/apply-filters", applyFilter)

router.post("/apply-filters-vendor",AuthenticatedVendorMiddleware, applyFilter)

module.exports = router;
