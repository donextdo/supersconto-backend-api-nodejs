const express = require('express')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid');

const { 
    getAllProducts, 
    createProduct, 
    getProduct, 
    updateProduct, 
    deleteProduct, 
    countDocuments 
} = require('../controllers/products')

const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
} = require('../middleware/verifyToken')

const FILE_TYPE_MAP = {
    'image/png' : 'png',
    'image/jpeg' : 'jpeg',
    'image/jpg' : 'jpg' 
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function(req, file, cb) {
        const fileName = uuidv4()
        const extention = FILE_TYPE_MAP[file.mimetype]
        cb(null, `${fileName}-${Date.now()}.${extention}`)
    }
})

const uploadOptions = multer({storage: storage})

const router = express.Router()

// router.route('/').get(getAllProducts).post(createProduct)

router.get('/', getAllProducts)

router.get('/find/:id', getProduct)

router.post('/', verifyTokenAndAdmin, uploadOptions.array('images', 5), createProduct)

router.put('/:id', verifyTokenAndAdmin, updateProduct)

router.delete('/:id', verifyTokenAndAdmin, deleteProduct)

router.get('/count', verifyTokenAndAdmin, countDocuments)

module.exports = router