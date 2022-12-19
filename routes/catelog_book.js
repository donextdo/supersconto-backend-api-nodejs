const express = require('express')

const { 
    getAllCatelogBook, 
    createCatelogBook, 
    getCatelogBook, 
    updateCatelogBook, 
    deleteCatelogBook, 
    countDocuments 
} = require('../controllers/catelog_book')

const FILE_TYPE_MAP = {
    'image/png' : 'png',
    'image/jpeg' : 'jpeg',
    'image/jpg' : 'jpg' 
}

const router = express.Router()

router.get('/', getAllCatelogBook)

router.get('/find/:id', getCatelogBook)

router.post('/', createCatelogBook)

router.patch('/:id', updateCatelogBook)

router.delete('/:id', deleteCatelogBook)

router.get('/count', countDocuments)

module.exports = router