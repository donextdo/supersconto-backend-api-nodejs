const mongoose = require("mongoose");

const subCategoryLevelThreeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mainCategoryId: {
    type: String,
    ref: "SubCategoryLevelTwo",
  },
});

module.exports = mongoose.model(
  "SubCategoryLevelThree",
  subCategoryLevelThreeSchema
);
