const CatelogBook = require('../models/catelog_book')

const getAllCatelogBook = async (req, res) => {

    const query = req.query

    try {

        let catelogBooks

        if(query.shop) {
            catelogBooks = await CatelogBook.find({
                shop_id: query.shop
            }).sort({_id: -1})
            .populate({
                path: 'shop_id',
                select: 'shop_name'
            })
            .populate({
                path: 'pages',
                select: 'page_image'
            })
        }
        else {
            catelogBooks = await CatelogBook.find().sort({_id: -1})
            .populate({
                path: 'shop_id',
                select: 'shop_name'
            })
            .populate({
                path: 'pages',
                select: 'page_image'
            })
        }

        res.status(200).json(catelogBooks)

    } catch (error) {
        res.status(500).json(error)
    }
}


const createCatelogBook = async (req, res) => {
    
    const newCatelogBook = new CatelogBook({ ...req.body })

    try {

        const CatelogBook = await newCatelogBook.save();

        res.status(201).json(CatelogBook);

    } catch (error) {
        res.status(500).json(error);
    }
}



const getCatelogBook = async (req, res) => {

    try {

        const catelogBook = await CatelogBook.findById(req.params.id).populate({
            path: 'pages',
            populate: {
                path: 'items',
                model: 'CatelogBookPageItem'
            }
        })

        if(!catelogBook) {
            return res.status(404).json({msg: `No CatelogBook associate with ${req.params.id}`})
        }

        res.status(200).json(catelogBook)

    } catch (error) {
        res.status(500).json(error)
    }
}

const updateCatelogBook = async (req, res) => {

    try {

        const catelogBookExist = await CatelogBook.findById(req.params.id)

        if(!catelogBookExist) {
            return res.status(404).json({msg: `No CatelogBook with ${req.params.id}`})
        }

        const catelogBook = await CatelogBook.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },
        {
            new: true,
            runValidators: true
        })

        res.status(200).json(catelogBook)

    }catch(error) {
        res.status(500).json(error)
    }
}

const deleteCatelogBook = async (req, res) => {

    try {
        const catelogBook = await CatelogBook.findById(req.params.id)

        if(!catelogBook) {
            return res.status(404).json({msg: `No CatelogBook with ${req.params.id}`})
        }

        await CatelogBook.findByIdAndDelete(req.params.id)

        res.status(200).json({msg: 'Successfully delete CatelogBook'})

    } catch(error) {
        res.status(500).json(error)
    }
}

const countDocuments = async (req, res) => {

    try {
        const count = await CatelogBook.countDocuments()

        res.status(200).json(count)

    } catch (error) {

        res.status(500).json(error)

    }
}

module.exports = {
    getAllCatelogBook,
    createCatelogBook,
    getCatelogBook,
    updateCatelogBook,
    deleteCatelogBook,
    countDocuments
}