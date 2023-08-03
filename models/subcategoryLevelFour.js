const mongoose = require("mongoose");

const subCategoryLevelFourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mainCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategoryLevelThree",
  },
});

module.exports = mongoose.model(
  "SubCategoryLevelFour",
  subCategoryLevelFourSchema
);
