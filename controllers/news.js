const News = require("../models/news");
const DEFAULT_ITEMS_PER_PAGE = 10; // Default items per page value
const FileService = require('../middleware/s3')

const dotenv = require('dotenv');
dotenv.config();

const getAllNews = async (req, res) => {
  try {
    let news;

    news = await News.find().sort({ _id: -1 });

    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

const getAllNewsParams = async (req, res) => {
  try {
    const { page = 1, search = '', itemsPerPage = DEFAULT_ITEMS_PER_PAGE } = req.query;
    const options = {
      sort: { _id: -1 },
      skip: (page - 1) * itemsPerPage,
      limit: parseInt(itemsPerPage),
    };

    let query = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const totalItems = await News.countDocuments(query);
    const news = await News.find(query, null, options);

    res.status(200).json({
      news,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalItems / itemsPerPage),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const createNews = async (req, res) => {
  const file = req.file;

  const imgURL = await FileService.uploadFile(req, res);
  let bucketUrl = null;


  if (file) {
    bucketUrl = `https://supersconto-images-bucket.s3.eu-west-3.amazonaws.com/${imgURL}`
  }

  const { images, ...payload } = req.body;

  const newNews = new News({
    ...payload,
    image : bucketUrl,
  });

  try {
    const News = await newNews.save();
    res.status(201).json(News);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server error" });
  }
};

const getNews = async (req, res) => {
    console.log("dabdhabdhbdhbawdh")

  try {
    const oneNew = await News.findById(req.params.id);
    if (!oneNew) {
      return res
        .status(404)
        .json({ msg: `No News associate with ${req.params.is}` });
    }

    res.status(200).json(oneNew);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server error" });
  }
};

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
    const id = req.params.id;

    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({
        Success: false,
        message: `Cannot find news with given id`,
      });
    }

    const file = req.file;
    const imgURL = await FileService.uploadFile(req, res);
    let bucketUrl = null;


  if (file) {
    bucketUrl = `https://supersconto-images-bucket.s3.eu-west-3.amazonaws.com/${imgURL}`
  }


    const updatedNews = await News.findByIdAndUpdate(
      id,
      {
        $set: {
          ...req.body,
          image : bucketUrl,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json(updatedNews);
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

const deleteNews = async (req, res) => {
  try {
    const Newss = await News.findById(req.params.id);

    if (!Newss) {
      return res.status(404).json({ msg: `No prodcut with ${req.params.id}` });
    }

    await News.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Successfully delete News" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

const countDocuments = async (req, res) => {
  try {
    const count = await News.countDocuments();
    res.status(200).json(count);
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

module.exports = {
  getAllNews,
  getNews,
  createNews,
  updateNews,
  deleteNews,
  countDocuments,
  getAllNewsParams
};
