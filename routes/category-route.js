const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category_controller");

router.post("/main-categories", categoryController.createMainCategory);
router.post("/sub-categories", categoryController.createSubCategory);
router.post(
  "/sub-categories-level-two",
  categoryController.createSubCategoryLevelTwo
);
router.post(
  "/sub-categories-level-three",
  categoryController.createSubCategoryLevelThree
);
router.post(
  "/sub-categories-level-four",
  categoryController.createSubCategoryLevelFour
);
router.get("/categories", categoryController.getAllCategories);
router.get("/categories/getall", categoryController.getAllCategoriesParams);
router.get("/categories/:id", categoryController.getMainCategoryById);
router.get("/subcategories/:id", categoryController.getSubCategoryById);
router.get(
  "/subcategoriesLevelTwo/:id",
  categoryController.getSubCategoryLevelTwoById
);
router.get(
  "/subcategoriesLevelThree/:id",
  categoryController.getSubCategoryLevelThreeById
);
router.get(
  "/subcategoriesLevelFour/:id",
  categoryController.getSubCategoryLevelFourById
);
router.put("/categories/:id", categoryController.updateCategory);
router.delete("/categories/:id", categoryController.deleteCategory);
router.get(
  "/:mainCategoryId",
  categoryController.getSubCategoryByMainCategoryId
);
// router.get(
//   "/subcategoryltwo/:mainCategoryId",
//   categoryController.getSubCategoryLevelTwoBySubCategoryId
// );
// router.get(
//   "/subcategorylthree/:mainCategoryId",
//   categoryController.getSubCategoryLevelThreeBySubCategoryId
// );
// router.get(
//   "/subcategorylfour/:mainCategoryId",
//   categoryController.getSubCategoryLevelFourBySubCategoryId
// );
module.exports = router;
