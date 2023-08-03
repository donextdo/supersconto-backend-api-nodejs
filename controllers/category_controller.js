const MainCategory = require("../models/maincategory");
const SubCategory = require("../models/subcategory");
const SubcategoryLevelTwo = require("../models/subcategoryLevelTwo");
const SubcategoryLevelThree = require("../models/subcategoryLevelThree");
const SubcategoryLevelFour = require("../models/subcategoryLevelFour");

const createMainCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const mainCategory = new MainCategory({ name });
    await mainCategory.save();
    res.status(201).json(mainCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

const createSubCategory = async (req, res) => {
  try {
    const { name, mainCategoryName } = req.body;
    let mainCategoryId = null;
    if (mainCategoryName) {
      const existingMainCategory = await MainCategory.findOne({
        name: mainCategoryName,
      });
      if (existingMainCategory) {
        mainCategoryId = existingMainCategory._id;
      }
    }
    const subCategory = new SubCategory({ name, mainCategoryId });
    await subCategory.save();
    res.status(201).json(subCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

const createSubCategoryLevelTwo = async (req, res) => {
  try {
    const { name, mainCategoryName } = req.body;
    let mainCategoryId = null;
    if (mainCategoryName) {
      const existingMainCategory = await SubCategory.findOne({
        name: mainCategoryName,
      });
      if (existingMainCategory) {
        mainCategoryId = existingMainCategory._id;
      }
    }
    const subCategoryLevelTwo = new SubcategoryLevelTwo({
      name,
      mainCategoryId,
    });
    await subCategoryLevelTwo.save();
    res.status(201).json(subCategoryLevelTwo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

const createSubCategoryLevelThree = async (req, res) => {
  try {
    const { name, mainCategoryName } = req.body;
    let mainCategoryId = null;
    if (mainCategoryName) {
      const existingMainCategory = await SubcategoryLevelTwo.findOne({
        name: mainCategoryName,
      });
      if (existingMainCategory) {
        mainCategoryId = existingMainCategory._id;
      }
    }
    const subCategoryLevelThree = new SubcategoryLevelThree({
      name,
      mainCategoryId,
    });
    await subCategoryLevelThree.save();
    res.status(201).json(subCategoryLevelThree);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

const createSubCategoryLevelFour = async (req, res) => {
  try {
    const { name, mainCategoryName } = req.body;
    let mainCategoryId = null;
    if (mainCategoryName) {
      const existingMainCategory = await SubcategoryLevelThree.findOne({
        name: mainCategoryName,
      });
      if (existingMainCategory) {
        mainCategoryId = existingMainCategory._id;
      }
    }
    const subCategoryLevelFour = new SubcategoryLevelFour({
      name,
      mainCategoryId,
    });
    await subCategoryLevelFour.save();
    res.status(201).json(subCategoryLevelFour);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

const getAllCategories = async (req, res) => {
  
  try {
    const subCategoriesLevelFour = await SubcategoryLevelFour.find().populate({
      path: "mainCategoryId",
      populate: [
        {
          path: "mainCategoryId",
          populate: [
            { path: "mainCategoryId", populate: [{ path: "mainCategoryId" }] },
          ],
        },
      ],
    });
    const subCategoriesLevelThree = await SubcategoryLevelThree.find().populate(
      {
        path: "mainCategoryId",
        populate: [
          { path: "mainCategoryId", populate: [{ path: "mainCategoryId" }] },
        ],
      }
    );
    const subCategoriesLevelTwo = await SubcategoryLevelTwo.find().populate({
      path: "mainCategoryId",
      populate: [{ path: "mainCategoryId" }],
    });
    const subCategories = await SubCategory.find().populate({
      path: "mainCategoryId",
      populate: [{ path: "mainCategoryId" }],
    });
    const mainCategories = await MainCategory.find();
    res.status(200).json({
      mainCategories: mainCategories,
      subCategories: subCategories,
      subCategoriesLevelTwo: subCategoriesLevelTwo,
      subCategoriesLevelThree: subCategoriesLevelThree,
      subCategoriesLevelFour: subCategoriesLevelFour,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

const getMainCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const mainCategory = await MainCategory.findById(id);
    if (!mainCategory) {
      return res.status(404).json({ message: "Main category not found" });
    }
    res.status(200).json(mainCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

const getSubCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      return res.status(404).json({ message: "Sub category not found" });
    }
    res.status(200).json(subCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

const getSubCategoryLevelTwoById = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategoryLevelTwo = await SubcategoryLevelTwo.findById(id);
    if (!subCategoryLevelTwo) {
      return res.status(404).json({ message: "Sub category not found" });
    }
    res.status(200).json(subCategoryLevelTwo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

const getSubCategoryLevelThreeById = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategoryLevelThree = await SubcategoryLevelThree.findById(id);
    if (!subCategoryLevelThree) {
      return res.status(404).json({ message: "Sub category not found" });
    }
    res.status(200).json(subCategoryLevelThree);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

const getSubCategoryLevelFourById = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategoryLevelFour = await SubcategoryLevelFour.findById(id);
    if (!subCategoryLevelFour) {
      return res.status(404).json({ message: "Sub category not found" });
    }
    res.status(200).json(subCategoryLevelFour);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

const getSubCategoryByMainCategoryId = async (req, res) => {
  try {
    const { mainCategoryId } = req.params;
    console.log("mainCategoryId: ", mainCategoryId);

    let subCategories = await SubCategory.find({
      mainCategoryId: mainCategoryId,
    });

    if (!subCategories || subCategories.length === 0) {
      subCategories = await SubcategoryLevelTwo.find({
        mainCategoryId: mainCategoryId,
      });

      if (!subCategories || subCategories.length === 0) {
        subCategories = await SubcategoryLevelThree.find({
          mainCategoryId: mainCategoryId,
        });
        if (!subCategories || subCategories.length === 0) {
          subCategories = await SubcategoryLevelFour.find({
            mainCategoryId: mainCategoryId,
          });
          if (!subCategories || subCategories.length === 0) {
            return res.status(404).json({ message: "Subcategories not found" });
          }
        }
      }
    }

    res.status(200).json(subCategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

// const getSubCategoryLevelTwoBySubCategoryId = async (req, res) => {
//   try {
//     const { mainCategoryId } = req.params;
//     console.log("mainCategoryId : ", mainCategoryId);
//     const subCategory = await SubcategoryLevelTwo.find({
//       mainCategoryId: mainCategoryId,
//     });
//     if (!subCategory) {
//       return res.status(404).json({ message: "Sub category not found" });
//     }
//     res.status(200).json(subCategory);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server error" });
//   }
// };

// const getSubCategoryLevelThreeBySubCategoryId = async (req, res) => {
//   try {
//     const { mainCategoryId } = req.params;
//     console.log("mainCategoryId : ", mainCategoryId);
//     const subCategory = await SubcategoryLevelThree.find({
//       mainCategoryId: mainCategoryId,
//     });
//     if (!subCategory) {
//       return res.status(404).json({ message: "Sub category not found" });
//     }
//     res.status(200).json(subCategory);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server error" });
//   }
// };

// const getSubCategoryLevelFourBySubCategoryId = async (req, res) => {
//   try {
//     const { mainCategoryId } = req.params;
//     console.log("mainCategoryId : ", mainCategoryId);
//     const subCategory = await SubcategoryLevelFour.find({
//       mainCategoryId: mainCategoryId,
//     });
//     if (!subCategory) {
//       return res.status(404).json({ message: "Sub category not found" });
//     }
//     res.status(200).json(subCategory);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server error" });
//   }
// };

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Check if category with given id exists
    let category = await MainCategory.findById(id);
    if (!category) {
      category = await SubCategory.findById(id);
      if (!category) {
        category = await SubcategoryLevelTwo.findById(id);
        if (!category) {
          category = await SubcategoryLevelThree.findById(id);
          if (!category) {
            category = await SubcategoryLevelFour.findById(id);
            if (!category) {
              return res.status(404).json({ message: "Category not found" });
            }
          }
        }
      }
    }

    // Update name and save category
    category.name = name;
    await category.save();

    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error" });
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
        if (!category) {
          category = await SubcategoryLevelTwo.findById(id);
          if (!category) {
            category = await SubcategoryLevelThree.findById(id);
            if (!category) {
              category = await SubcategoryLevelFour.findById(id);
              if (!category) {
                return res.status(404).json({ message: "Category not found" });
              }
            }
          }
        }
      }
    }

    // Delete category
    await category.remove();

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

module.exports = {
  createMainCategory,
  createSubCategory,
  createSubCategoryLevelTwo,
  createSubCategoryLevelThree,
  createSubCategoryLevelFour,
  getAllCategories,
  getMainCategoryById,
  updateCategory,
  deleteCategory,
  getSubCategoryById,
  getSubCategoryLevelTwoById,
  getSubCategoryLevelThreeById,
  getSubCategoryLevelFourById,
  getSubCategoryByMainCategoryId,
  // getSubCategoryLevelTwoBySubCategoryId,
  // getSubCategoryLevelThreeBySubCategoryId,
  // getSubCategoryLevelFourBySubCategoryId,
};
