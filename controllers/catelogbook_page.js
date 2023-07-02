const CatelogBookPage = require("../models/catelogbook_page");
const CatelogBook = require("../models/catelog_book");

const createCatelogBookPages = async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send("No Page Image in request");
  }

  const imgPath = `${process.env.IMG_SERVER}/public/images/${file.filename}`;
  const { page_image, dimensions,...payload } = req.body;
  const newCatelogBookPage = new CatelogBookPage({
    ...payload,
    page_image: imgPath,
    dimensions:JSON.parse(dimensions)
  });

  try {
    const catelogBookPage = await newCatelogBookPage.save();

    await CatelogBook.findByIdAndUpdate(req.body.catelog_book_id, {
      $push: { pages: catelogBookPage.id },
    });

    res.status(200).json(catelogBookPage);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

const getAllCatelogBookPages = async (req, res) => {
  const query = req.query;

  try {
    let CatelogBookPages;

    if (query.catelog) {
      CatelogBookPages = await CatelogBookPage.find({
        catelog_book_id: query.catelog,
      })
        .sort({ _id: -1 })
        .populate("items");
    } else if (query.shop) {
      CatelogBookPages = await CatelogBookPage.find({
        shop_id: query.shop,
      })
        .sort({ _id: -1 })
        .populate("items");
    } else {
      CatelogBookPages = await CatelogBookPage.find()
        .sort({ _id: -1 })
        .populate("items");
    }

    res.status(200).json(CatelogBookPages);
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

const getCatelogBookPage = async (req, res) => {
  try {
    const catelogBookPage = await CatelogBookPage.findById(
      req.params.id
    ).populate("items");

    if (!catelogBookPage) {
      return res
        .status(404)
        .json({ msg: `No page associate with ${req.params.is}` });
    }

    res.status(200).json(catelogBookPage);
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

const updateCatelogBookPage = async (req, res) => {
  try {
    const catelogBookPageExist = await CatelogBookPage.findById(req.params.id);

    if (!catelogBookPageExist) {
      return res.status(404).json({ msg: `No Flyer with ${req.params.id}` });
    }

    const catelogBookPage = await CatelogBookPage.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json(catelogBookPage);
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

const deleteCatelogBook = async (req, res) => {
  try {
    const catelog_book_page = await CatelogBookPage.findById(req.params.id);

    if (!catelog_book_page) {
      return res.status(404).json({ msg: `No Flyer with ${req.params.id}` });
    }

    await CatelogBookPage.findByIdAndDelete(req.params.id);

    res.status(200).json({ msg: "Successfully delete flyer" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

const countDocuments = async (req, res) => {
  try {
    const count = await CatelogBookPage.countDocuments();
    res.status(200).json(count);
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

module.exports = {
  getAllCatelogBookPages,
  createCatelogBookPages,
  getCatelogBookPage,
  updateCatelogBookPage,
  deleteCatelogBook,
  countDocuments,
};
