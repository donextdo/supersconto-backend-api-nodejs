const express = require('express')
const multer = require('multer')
const storage = require('../middleware/multerStorage')

const {    
    getAllCatelogBookPageItems, 
    getCatelogBookPageItem,
    updateCatelogBookPageItem,
    createCatelogBookPageItem, 
    deleteCatelogBookPageItem, 
    countDocuments 
} = require('../controllers/catalog_page_item');

const uploadOptions = multer({storage: storage})

const router = express.Router()

router.get('/', getAllCatelogBookPageItems)

router.get('/find/:id', getCatelogBookPageItem)

router.post('/', uploadOptions.single('product_image'), createCatelogBookPageItem)

router.patch('/:id', updateCatelogBookPageItem)

router.delete('/:id', deleteCatelogBookPageItem)

router.get('/count', countDocuments)

module.exports = router