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

const getAllCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find();
    const mainCategories = await MainCategory.find();
    res.status(200).json({'mainCategories':mainCategories,'subCategories':subCategories});
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




const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    // Check if category with given id exists
    let category = await MainCategory.findById(id);
    if (!category) {
      category = await SubCategory.findById(id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
    }
    
    // Update name and save category
    category.name = name;
    await category.save();
    
    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if category with given id exists
    let category = await MainCategory.findById(id);
    if (!category) {
      category = await SubCategory.findById(id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
    }
    
    // Delete category
    await category.remove();
    
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



// const updateMainCategory = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name } = req.body;
//     const mainCategory = await MainCategory.findByIdAndUpdate(
//       id,
//       { name },
//       { new: true }
//     );
//     if (!mainCategory) {
//       return res.status(404).json({ message: 'Main category not found' });
//     }
//     res.status(200).json(mainCategory);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const deleteMainCategory = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const mainCategory = await MainCategory.findByIdAndDelete(id);
//     if (!mainCategory) {
//       return res.status(404).json({ message: 'Main category not found' });
//     }
//     // Delete all sub-categories associated with the main category
//     await SubCategory.deleteMany({ mainCategoryId: id });
//     res.status(200).json({ message: 'Main category deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };



module.exports = {
  createMainCategory,
  createSubCategory,
  getAllCategories,
  getMainCategoryById,
  updateCategory,
  deleteCategory,
}
 