const express = require('express')
const multer = require('multer')
const storage = require('../middleware/multerStorage')

const { 
    getAllNews,
    getNews,
    createNews,
    updateNews,
    deleteNews,
} = require('../controllers/news')


const uploadOptions = multer({storage: storage})

const router = express.Router()

router.get('/', getAllNews)

router.get('/find/:id', getNews)

router.post('/', uploadOptions.single('images'), createNews)

router.patch('/:id', uploadOptions.single('images'), updateNews)

router.delete('/:id', deleteNews)

module.exports = router;