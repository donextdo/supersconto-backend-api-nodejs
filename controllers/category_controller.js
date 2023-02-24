const MainCategory = require('../models/maincategory');
const SubCategory = require('../models/subcategory');


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

const getAllMainCategories = async (req, res) => {
  try {
    const mainCategories = await MainCategory.find();
    res.status(200).json(mainCategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMainCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const mainCategory = await MainCategory.findById(id);
    if (!mainCategory) {
      return res.status(404).json({ message: 'Main category not found' });
    }
    res.status(200).json(mainCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const updateMainCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const mainCategory = await MainCategory.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    if (!mainCategory) {
      return res.status(404).json({ message: 'Main category not found' });
    }
    res.status(200).json(mainCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteMainCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const mainCategory = await MainCategory.findByIdAndDelete(id);
    if (!mainCategory) {
      return res.status(404).json({ message: 'Main category not found' });
    }
    // Delete all sub-categories associated with the main category
    await SubCategory.deleteMany({ mainCategoryId: id });
    res.status(200).json({ message: 'Main category deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



module.exports = {
  createMainCategory,
  createSubCategory,
  getAllMainCategories,
  getMainCategoryById,
  updateMainCategory,
  deleteMainCategory,
}
 