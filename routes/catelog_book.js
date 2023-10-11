const express = require('express')

const {
    getAllCatelogBook,
    createCatelogBook,
    getCatelogBook,
    updateCatelogBook,
    deleteCatelogBook,
    countDocuments,
    getCatelogBookByVendor,
    getAllCatelogBookparams,
    cloneCatelogBook
} = require('../controllers/catelog_book')

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const router = express.Router()

router.get('/', getAllCatelogBook)

router.get('/getall', getAllCatelogBookparams)

router.get('/find/:id', getCatelogBook)

router.get('/by-vendor/:id', getCatelogBookByVendor)

router.post('/', createCatelogBook)

router.post('/clone', cloneCatelogBook)

router.patch('/:id', updateCatelogBook)

router.delete('/:id', deleteCatelogBook)

router.get('/count', countDocuments)

module.exports = router