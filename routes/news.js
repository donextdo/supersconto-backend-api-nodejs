const express = require('express')
const multer = require('multer')
const storage = require('../middleware/multerStorage')
const file = require('../middleware/file');

const { 
    getAllNews,
    getNews,
    createNews,
    updateNews,
    deleteNews,
    getAllNewsParams,
} = require('../controllers/news')


const router = express.Router()

router.get('/', getAllNews)

router.get('/getall', getAllNewsParams)

router.get('/find/:id', getNews)

router.post('/', file.single('images'), createNews)

router.patch('/:id', file.single('images'), updateNews)

router.delete('/:id', deleteNews)

module.exports = router;