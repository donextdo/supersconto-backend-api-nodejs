const News = require('../models/news')

const getAllNews = async (req, res) => {


    try {

        let news

            news = await News.find().sort({_id: -1})
       
        
        res.status(200).json(news)
    } catch (error) {
        res.status(500).json(error)
    }
}

const createNews = async (req, res) => {
    const files = req.files

    console.log(files)

    if(files.length < 1) {
        return res.status(400).send('No Document in request')
    }

    const basePath = `${req.protocol}://${req.get('host')}/public/images/`
    const fileNames = files.map(file => {
        return `${basePath}${file.filename}`
    })

    const {images, ...otherData} = req.body

    const newProduct = new News({...otherData, images: fileNames})

    try {
        const product = await newProduct.save()
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json(error)
    }
}

const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if(!product) {
            return res.status(404).json({msg: `No product associate with ${req.params.is}`})
        }

        res.status(200).json(product)
    } catch (error) {
        res.status(500).json(error)
    }
}

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },
        {
            new: true,
            runValidators: true
        })

        res.status(200).json(product)
    }catch(error) {
        res.status(500).json(error)
    }
}

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if(!product) {
            return res.status(404).json({msg: `No prodcut with ${req.params.id}`})
        }

        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json({msg: 'Successfully delete product'})
    } catch(error) {
        res.status(500).json(error)
    }
}

const countDocuments = async (req, res) => {
    try {
        const count = await Product.countDocuments()
        res.status(200).json(count)
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {
    getAllProducts,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    countDocuments
}