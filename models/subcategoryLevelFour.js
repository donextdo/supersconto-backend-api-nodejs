const mongoose = require("mongoose");

const subCategoryLevelFourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mainCategoryId: {
    type: String,
    ref: "SubCategoryLevelThree",
  },
});

module.exports = mongoose.model(
  "SubCategoryLevelFour",
  subCategoryLevelFourSchema
);
