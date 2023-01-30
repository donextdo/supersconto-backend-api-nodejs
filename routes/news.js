const express = require('express')
const multer = require('multer')
const storage = require('../middleware/multerStorage')

const { 
    getAllNews, 
    createNews, 
    getNews, 
    updateNews, 
    deleteNews, 
    countDocuments
  
} = require('../controllers/news')


const uploadOptions = multer({storage: storage})

const router = express.Router()

router.get('/', getAllNews)

router.get('/find/:id', getNews)

router.post('/', uploadOptions.single('logo_img'), createNews)

router.patch('/:id', updateNews)

router.delete('/:id', deleteNews)

router.get('/count', countDocuments)

module.exports = router