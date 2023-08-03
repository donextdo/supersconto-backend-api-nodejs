const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mainCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MainCategory',
    //required: true,
  },
});

module.exports = mongoose.model('SubCategory', subCategorySchema);
