const { request } = require("express");
const axios = require("axios");
const CatelogBookPageItem = require("../models/catalog_page_item");

const getproductByfilter = async (req, res) => {
  try {
    const categoryId = req.query.categoryId;
    const subCategories = req.query.subCategories;
    const brands = req.query.brands;
    const minPrice = parseFloat(req.query.min_price);
    const maxPrice = parseFloat(req.query.max_price);

    const filter = {
      $and: [
        buildFilterObject(
            categoryId,
            subCategories,
            brands,
            minPrice,
            maxPrice
        )
      ]
    };

    // Retrieve the filtered products from the database
    const products = await CatelogBookPageItem.find(filter);

    res.status(200).json(products);
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const buildFilterObject = (
  categoryId,
  subCategories,
  brands,
  minPrice,
  maxPrice
) => {
  const filter = {};

  if (categoryId) {
    filter.product_category = categoryId;
  }

  if (subCategories) {
    const subCatArr = subCategories.split(",");
    filter.product_sub_category = { $in: subCatArr };
  }

  if (brands) {
    const brandArr = brands.split(",");
    filter.brand = { $in: brandArr };
  }

  if (!isNaN(minPrice) && !isNaN(maxPrice)) {
    if (minPrice > 0 && maxPrice > 0) {
      filter.unit_price = {$gte: minPrice, $lte: maxPrice};
    }
  }

  return filter;
};

module.exports = {
  getproductByfilter,
};
