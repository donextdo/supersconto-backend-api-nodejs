const CatelogBookPage = require('../models/catelogbook_page')
const CatelogBookPageItem = require('../models/catalog_page_item')

const getAllCatelogBookPageItems = async (req, res) => {

    const query = req.query

    try {

        let CatelogBookPageItems
        
        if(query.catelog){
            CatelogBookPageItems = await CatelogBookPageItem.find({
                catelog_book_id: query.catelog
            }).sort({_id: -1})
        }
        else if(query.shop){
            CatelogBookPageItems = await CatelogBookPageItem.find({
                shop_id: query.shop
            }).sort({_id: -1})
        }
        else if(query.page){
            CatelogBookPageItems = await CatelogBookPageItem.find({
                catelog_page_id: query.page
            }).sort({_id: -1})
        }
        else {
            CatelogBookPageItems = await CatelogBookPageItem.find().sort({_id: -1})
        }

        res.status(200).json(CatelogBookPageItems)

    } catch (error) {

        res.status(500).json(error)

    }

}


const createCatelogBookPageItem = async (req, res) => {

    const file = req.file

    if(!file) {
        return res.status(400).send('No Item Image in request')
    }

    const imgPath = `${req.protocol}://${req.get('host')}/public/images/${file.filename}`
    const {product_image, data} = req.body
    const payload = JSON.parse(data)
    const newCatelogBookPageItem = new CatelogBookPageItem({ ...payload, product_image: imgPath })

    try {

        const CatelogBookPageItem = await newCatelogBookPageItem.save()

        await CatelogBookPage.findByIdAndUpdate(
            payload.catelog_page_id,
            {
                $push: {items: CatelogBookPageItem.id}
            }
        )


        res.status(200).json( CatelogBookPageItem )

    } catch (error) {
        res.status(500).json(error)
    }
}

const getCatelogBookPageItem = async (req, res) => {
    try {
        const catelogBookPageItem = await CatelogBookPageItem.findById(req.params.id)

        if(!catelogBookPageItem) {
            return res.status(404).json({msg: `No catelogBookPageItem associate with ${req.params.is}`})
        }

        res.status(200).json(catelogBookPageItem)
    } catch (error) {
        res.status(500).json(error)
    }
}

const updateCatelogBookPageItem = async (req, res) => {
    try {

        const catelogBookPageItemExist = await CatelogBookPageItem.findById(req.params.id)

        if(!catelogBookPageItemExist) {
            return res.status(404).json({msg: `No CatelogBook with ${req.params.id}`})
        }

        const catelogBookPageItem = await CatelogBookPageItem.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },
        {
            new: true,
            runValidators: true
        })

        res.status(200).json(catelogBookPageItem)
    }catch(error) {
        res.status(500).json(error)
    }
}

const deleteCatelogBookPageItem = async (req, res) => {
    try {
        const catelogBookPageItem = await CatelogBookPageItem.findById(req.params.id)

        if(!catelogBookPageItem) {
            return res.status(404).json({msg: `No CatelogBook with ${req.params.id}`})
        }

        await CatelogBookPageItem.findByIdAndDelete(req.params.id)
        res.status(200).json({msg: 'Successfully delete CatelogBookPageItem'})
    } catch(error) {
        res.status(500).json(error)
    }
}

const countDocuments = async (req, res) => {
    try {
        const count = await CatelogBookPageItem.countDocuments()
        res.status(200).json(count)
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {
    getAllCatelogBookPageItems,
    createCatelogBookPageItem,
    getCatelogBookPageItem,
    updateCatelogBookPageItem,
    deleteCatelogBookPageItem,
    countDocuments
}