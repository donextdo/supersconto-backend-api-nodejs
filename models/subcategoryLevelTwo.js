const mongoose = require("mongoose");

const subCategoryLevelTwoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mainCategoryId: {
    type: String,
    ref: "SubCategory",
  },
});

module.exports = mongoose.model(
  "SubCategoryLevelTwo",
  subCategoryLevelTwoSchema
);
