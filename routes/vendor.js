const express = require('express')
const multer = require('multer')
const storage = require('../middleware/multerStorage')

const { 
    getAllVendors,
    getVendorById,
    createVendor,
    updateVendor,
    updateProfilePic,
    deleteVendor,
    countVendors,
    getAllVendorsParams
} = require('../controllers/vendor')


const uploadOptions = multer({storage: storage})

const router = express.Router()

router.get('/', getAllVendors)

router.get('/getall', getAllVendorsParams)

router.get('/find/:id', getVendorById)

router.post('/', uploadOptions.single('profile_pic'), createVendor)

router.patch('/:id', uploadOptions.single('profile_pic'), updateVendor)

router.patch('/profile-pic/:id', uploadOptions.single('profile_pic'), updateProfilePic)

router.delete('/:id', deleteVendor)

router.get('/count', countVendors)

module.exports = router