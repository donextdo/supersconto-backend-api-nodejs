const express = require('express')
const multer = require('multer')
const storage = require('../middleware/multerStorage')

const { 
    
    getAllCatelogBookPages, 
    getCatelogBookPage,
    updateCatelogBookPage,
    createCatelogBookPages, 
    deleteCatelogBook, 
    countDocuments 
} = require('../controllers/catelogbook_page');

const uploadOptions = multer({storage: storage})

const router = express.Router()

router.get('/', getAllCatelogBookPages)

router.get('/find/:id', getCatelogBookPage)

router.post('/', uploadOptions.single('page_image'), createCatelogBookPages)

router.patch('/:id', updateCatelogBookPage)

router.delete('/:id', deleteCatelogBook)

router.get('/count', countDocuments)

module.exports = router