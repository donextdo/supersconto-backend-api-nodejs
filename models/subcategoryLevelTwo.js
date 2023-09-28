const mongoose = require("mongoose");

const subCategoryLevelTwoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mainCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
  },
});

module.exports = mongoose.model(
  "SubCategoryLevelTwo",
  subCategoryLevelTwoSchema
);
