const Shop = require('../models/shop')

const getAllShops = async (req, res) => {

    try {

        let shops = await Shop.find().sort({_id: -1})

        res.status(200).json(shops)

    } catch (error) {

        res.status(500).json(error)

    }
}

const createShop = async (req, res) => {

    const file = req.file

    if (!file) {
        return res.status(400).send('No Logo Image in request')
    }

    const imgPath = `${req.protocol}://${req.get('host')}/public/images/${file.filename}`

    const {logo_img, ...payload} = req.body

    const newShop = new Shop({
        ...payload,
        logo_img: imgPath,
        coordinates: [payload.longitude, payload.latitude]
        // address: {...payload.address, geometry: {coordinate: [payload.longitude, payload.latitude]}}
    })

    try {

        const shop = await newShop.save()

        res.status(200).json(shop)

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

const getShop = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id).populate({
            path: 'catelog_books', populate: {
                path: 'pages', model: 'CatelogBookPage', populate: {
                    path: 'items', model: 'CatelogBookPageItem'

                }
            }
        })

        if (!shop) {
            return res.status(404).json({msg: `No product associate with ${req.params.is}`})
        }

        res.status(200).json(shop)
    } catch (error) {
        res.status(500).json(error)
    }
}

const updateShop = async (req, res) => {
    try {
        const id = req.params.id

        const sshop = await Shop.findById(id)

        if(!sshop) {
            return res.status(404).json({
                Success: false,
                message: `Cannot find shop with given id`
            })
        }

        const file = req.file

        let logo_img = Shop.logo_img

        if(file) {
            logo_img = `${req.protocol}://${req.get('host')}/public/images/${file.filename}`
        }

        const updatedShop = await Shop.findByIdAndUpdate(
            id,
            {
                $set: {
                    ...req.body,
                    logo_img
                }
            },
            {
                new: true,
                runValidators: true
            }
        )

        res.status(200).json(updatedShop)

    }
    catch (error) {
        res.status(500).json(error.message)
    }
}

const deleteShop = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id)

        if (!shop) {
            return res.status(404).json({msg: `No prodcut with ${req.params.id}`})
        }

        await Shop.findByIdAndDelete(req.params.id)

        res.status(200).json({msg: 'Successfully delete shop'})

    } catch (error) {
        res.status(500).json(error)
    }
}

const countDocuments = async (req, res) => {
    try {

        const count = await Shop.countDocuments()
        res.status(200).json(count)

    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {
    getAllShops,
    createShop,
    getShop,
    updateShop,
    deleteShop,
    countDocuments
}