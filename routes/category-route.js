const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category_controller');

router.post('/main-categories', categoryController.createMainCategory);
router.post('/sub-categories', categoryController.createSubCategory);

module.exports = router;
