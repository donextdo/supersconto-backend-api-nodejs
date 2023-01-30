const express = require('express');
const multer = require('multer')
const storage = require('../middleware/multerStorage')


const { 
    getAllVendors,
    createVendor,
    updateVendor, 
    deleteVendor } = require('../controllers/vendor');

const uploadOptions = multer({storage: storage})
const router = express.Router();

router.get('/', getAllVendors);
router.post('/', createVendor);
router.put('/:id', updateVendor);
router.delete('/:id', deleteVendor);

module.exports = router;
