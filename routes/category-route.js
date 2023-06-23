const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category_controller");

router.post("/main-categories", categoryController.createMainCategory);
router.post("/sub-categories", categoryController.createSubCategory);
router.get("/categories", categoryController.getAllCategories);
router.get("/categories/:id", categoryController.getMainCategoryById);
router.get("/subcategories/:id", categoryController.getSubCategoryById);
router.put("/categories/:id", categoryController.updateCategory);
router.delete("/categories/:id", categoryController.deleteCategory);
router.get(
  "/:mainCategoryId",
  categoryController.getSubCategoryByMainCategoryId
);

module.exports = router;
