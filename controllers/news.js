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
    // const files = req.files

    // console.log(files)

    // if(files.length < 1) {
    //     return res.status(400).send('No Document in request')
    // }

    // const basePath = `${process.env.IMG_SERVER}/public/images/`
    // const fileNames = files.map(file => {
    //     return `${basePath}${file.filename}`
    // })

    // const {images, ...otherData} = req.body

    // const newNews = new News({...otherData, images: fileNames})
    const file = req.file

    let img = null

    if(file) {
        img = `${process.env.IMG_SERVER}/public/images/${file.filename}`
    }

    const {images, ...payload} = req.body

    const newNews = new News({
        ...payload,
        img
    })
    try {
        const News = await newNews.save()
        res.status(200).json(News)
    } catch (error) {
        res.status(500).json(error)
    }
}

const getNews = async (req, res) => {
    try {
        const News = await News.findById(req.params.id)

        if(!News) {
            return res.status(404).json({msg: `No News associate with ${req.params.is}`})
        }

        res.status(200).json(News)
    } catch (error) {
        res.status(500).json(error)
    }
}

const updateNews = async (req, res) => {
    // try {
    //     const News = await News.findByIdAndUpdate(req.params.id, {
    //         $set: req.body
    //     },
    //     {
    //         new: true,
    //         runValidators: true
    //     })

    //     res.status(200).json(News)
    // }catch(error) {
    //     res.status(500).json(error)
    // }

    try {
        const id = req.params.id

        const news = await News.findById(id)

        if(!news) {
            return res.status(404).json({
                Success: false,
                message: `Cannot find news with given id`
            })
        }

        const file = req.file

        let images = news.images

        if(file) {
            profilePic = `${process.env.IMG_SERVER}/public/images/${file.filename}`
        }

        const updatedNews= await News.findByIdAndUpdate(
            id,
            {
                $set: {
                    ...req.body,
                    images
                }
            },
            {
                new: true,
                runValidators: true
            }
        )

        res.status(200).json(updatedNews)

    }
    catch (error) {
        res.status(500).json(error.message)
    }
}

const deleteNews = async (req, res) => {
    try {
        const Newss = await News.findById(req.params.id)

        if(!Newss) {
            return res.status(404).json({msg: `No prodcut with ${req.params.id}`})
        }

        await News.findByIdAndDelete(req.params.id)
        res.status(200).json({msg: 'Successfully delete News'})
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
    updateNews,
    deleteNews,
    countDocuments
}