const MainCategory = require('../models/MainCategory');
const SubCategory = require('../models/SubCategory');

 const createMainCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const mainCategory = new MainCategory({ name });
    await mainCategory.save();
    res.status(201).json(mainCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createSubCategory = async (req, res) => {
  try {
    const { name, mainCategoryName } = req.body;
    let mainCategoryId = null;
    if (mainCategoryName) {
      const existingMainCategory = await MainCategory.findOne({ name: mainCategoryName });
      if (existingMainCategory) {
        mainCategoryId = existingMainCategory._id;
      } else {
        const newMainCategory = new MainCategory({ name: mainCategoryName });
        const savedMainCategory = await newMainCategory.save();
        mainCategoryId = savedMainCategory._id;
      }
    } else {
      const existingSubCategory = await SubCategory.findOne({ name });
      if (existingSubCategory) {
        mainCategoryId = existingSubCategory._id;
      } else {
        const newSubCategory = new SubCategory({ name });
        const savedSubCategory = await newSubCategory.save();
        mainCategoryId = savedSubCategory._id;
      }
    }
    
    const subCategory = new SubCategory({ name, mainCategoryId });
    await subCategory.save();
    res.status(201).json(subCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



module.exports = {
  createMainCategory,
  createSubCategory
}
 