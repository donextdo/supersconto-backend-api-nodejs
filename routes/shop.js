const express = require('express')
const multer = require('multer')
const storage = require('../middleware/multerStorage')

const { 
    getAllShops, 
    createShop, 
    getShop, 
    updateShop, 
    deleteShop, 
    countDocuments 
} = require('../controllers/shop')


const uploadOptions = multer({storage: storage})

const router = express.Router()

router.get('/', getAllShops)

router.get('/find/:id', getShop)

router.post('/', uploadOptions.single('logo_img'), createShop)

router.patch('/:id',uploadOptions.single('logo_img'), updateShop)

router.delete('/:id', deleteShop)

router.get('/count', countDocuments)

module.exports = router