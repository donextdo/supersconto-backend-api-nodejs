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

    const newNews = new News({...otherData, images: fileNames})

    try {
        const news = await newNews.save()
        res.status(200).json(news)
    } catch (error) {
        res.status(500).json(error)
    }
}

const getNews = async (req, res) => {
    try {
        const news = await News.findById(req.params.id)

        if(!news) {
            return res.status(404).json({msg: `No news associate with ${req.params.is}`})
        }

        res.status(200).json(news)
    } catch (error) {
        res.status(500).json(error)
    }
}

const updateNews = async (req, res) => {
    try {
        const news = await News.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },
        {
            new: true,
            runValidators: true
        })

        res.status(200).json(news)
    }catch(error) {
        res.status(500).json(error)
    }
}

const deleteNews = async (req, res) => {
    try {
        const news = await News.findById(req.params.id)

        if(!news) {
            return res.status(404).json({msg: `No News with ${req.params.id}`})
        }

        await News.findByIdAndDelete(req.params.id)
        res.status(200).json({msg: 'Successfully delete news'})
    } catch(error) {
        res.status(500).json(error)
    }
}

const countDocuments = async (req, res) => {
    try {
        const count = await News.countDocuments()
        res.status(200).json(count)
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {
    getAllNews,
    createNews,
    getNews,
    updateNews,
    deleteNews,
    countDocuments
}