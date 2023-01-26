const CatelogBook = require('../models/catelog_book')
const Shop = require('../models/shop')

const getAllCatelogBook = async (req, res) => {

    const {lat, long, ...filter} = req.query

    try {
        let catelogBooks
        if (lat && long) {
            const result = await Shop.aggregate([
                {
                    '$geoNear': {
                        'near': {
                            'type': 'Point',
                            'coordinates': [
                                Number(long), Number(lat)
                            ]
                        },
                        'distanceField': 'distance',
                        'spherical': true
                    }
                }, {
                    '$lookup': {
                        'from': 'catelogbooks',
                        'localField': 'catelog_books',
                        'foreignField': '_id',
                        'as': 'books',
                        'pipeline': [
                            // { $match: {...filter } },
                            // {
                            //     '$lookup': {
                            //         'from': 'shops',
                            //         'localField': 'shop_id',
                            //         'foreignField': '_id',
                            //         'as': 'shop_id',
                            //         'pipeline': [
                            //             {
                            //                 '$project': {
                            //                     'shop_name': 1
                            //                 }
                            //             }
                            //         ]
                            //     }
                            // },
                            {
                                '$unwind': {
                                    'path': '$shop_id'
                                }
                            }, {
                                '$lookup': {
                                    'from': 'catelogbookpages',
                                    'localField': 'pages',
                                    'foreignField': '_id',
                                    'as': 'pages',
                                    'pipeline': [
                                        {
                                            '$project': {
                                                'page_image': 1
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }, {
                    '$project': {
                        'books': 1,
                        'shop_name': 1,
                        'distance': 1
                    }
                }
            ])

            catelogBooks = result.map(shop => {
                return shop.books.map(book => ({...book, shop_id: {shop_name: shop.shop_name, distance: shop.distance}}))
            }).flatMap(a=>a)
        } else {
            catelogBooks = await CatelogBook.find({
                ...filter
            }).sort({_id: -1})
                .populate({
                    path: 'shop_id', select: 'shop_name'
                })
                .populate({
                    path: 'pages', select: 'page_image'
                })
        }
        res.status(200).json(catelogBooks)

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}


const createCatelogBook = async (req, res) => {

    const newCatelogBook = new CatelogBook({...req.body})

    try {

        const CatelogBook = await newCatelogBook.save();
        if (CatelogBook) {
            await Shop.findByIdAndUpdate(CatelogBook.shop_id, {$push: {catelog_books: CatelogBook}}, {new: true})
        }

        res.status(201).json(CatelogBook);

    } catch (error) {
        res.status(500).json(error);
    }
}


const getCatelogBook = async (req, res) => {

    try {

        const catelogBook = await CatelogBook.findById(req.params.id).populate({
            path: 'pages', populate: {
                path: 'items', model: 'CatelogBookPageItem'
            }
        })

        if (!catelogBook) {
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

        if (!catelogBookExist) {
            return res.status(404).json({msg: `No CatelogBook with ${req.params.id}`})
        }

        const catelogBook = await CatelogBook.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {
            new: true, runValidators: true
        })

        res.status(200).json(catelogBook)

    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteCatelogBook = async (req, res) => {

    try {
        const catelogBook = await CatelogBook.findById(req.params.id)

        if (!catelogBook) {
            return res.status(404).json({msg: `No CatelogBook with ${req.params.id}`})
        }

        await CatelogBook.findByIdAndDelete(req.params.id)

        res.status(200).json({msg: 'Successfully delete CatelogBook'})

    } catch (error) {
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
    getAllCatelogBook, createCatelogBook, getCatelogBook, updateCatelogBook, deleteCatelogBook, countDocuments
}