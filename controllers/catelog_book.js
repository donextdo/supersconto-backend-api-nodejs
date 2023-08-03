const CatelogBook = require("../models/catelog_book");
const Shop = require("../models/shop");

const getAllCatelogBook = async (req, res) => {
  const { lat, long, ...filter } = req.query;

  try {
    let catelogBooks;
    if (lat && long) {
      // only works with v5 <=

      /*const result = await Shop.aggregate([
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
                            {
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
            ])*/

      // only works with v4 <=
      const result = await Shop.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [Number(long), Number(lat)],
            },
            distanceField: "distance",
            spherical: true,
          },
        },
        {
          $lookup: {
            from: "catelogbooks",
            let: { catalog_book_ids: "$catelog_books" },
            as: "books",
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ["$_id", "$$catalog_book_ids"],
                  },
                },
              },
              {
                $lookup: {
                  from: "catelogbookpages",
                  let: { page_ids: "$pages" },
                  as: "pages",
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $in: ["$_id", "$$page_ids"],
                        },
                      },
                    },
                    {
                      $project: {
                        page_image: 1,
                        page_no: 1,
                      },
                    },
                    {
                      $sort: { page_no: 1 } // Sort by the createdAt field in ascending order (1)
                      // For descending order, use { createdAt: -1 }
                    }
                  ],
                },
              },
            ],
          },
        },
        {
          $project: {
            books: 1,
            shop_name: 1,
            distance: 1,
            customized_shop_name: 1,
          },
        },
      ]);

      catelogBooks = result
        .map((shop) => {
          return shop.books.map((book) => ({
            ...book,
            shop_id: { shop_name: shop.shop_name, distance: shop.distance, customized_shop_name:shop.customized_shop_name },
          }));
        })
        .flatMap((a) => a);
    } else {
      catelogBooks = await CatelogBook.find({
        ...filter,
      })
        .sort({ _id: -1 })
        .populate({
          path: "shop_id",
          select: "shop_name",
        })
        .populate({
          path: "pages",
          select: "page_image",
        });
    }
    res.status(200).json(catelogBooks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

const createCatelogBook = async (req, res) => {
  const newCatelogBook = new CatelogBook({ ...req.body });

  try {
    const CatelogBook = await newCatelogBook.save();
    if (CatelogBook) {
      await Shop.findByIdAndUpdate(
        CatelogBook.shop_id,
        { $push: { catelog_books: CatelogBook } },
        { new: true }
      );
    }

    res.status(201).json(CatelogBook);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server error" });
  }
};

const getCatelogBook = async (req, res) => {
  try {
    const catelogBook = await CatelogBook.findById(req.params.id).populate({
      path: "pages",
      options: {
        sort: { page_no: 1 }
      },
      populate: {
        path: "items",
        model: "CatelogBookPageItem",
      },
    });

    if (!catelogBook) {
      return res
        .status(404)
        .json({ msg: `No CatelogBook associate with ${req.params.id}` });
    }

    res.status(200).json(catelogBook);
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

const getCatelogBookByVendor = async (req, res) => {
  try {

    const shops = await Shop.find({vendor: req.params.id}).lean()
    const catelogBook = await CatelogBook.find({ shop_id: { $in: shops.map(a => a._id) } }).populate([{
      path: "pages",
      populate: {
        path: "items",
        model: "CatelogBookPageItem",
      },
    },{path: "shop_id", select:'_id, shop_name'}]);

    if (!catelogBook) {
      return res
        .status(404)
        .json({ msg: `No CatelogBook associate with ${req.params.id}` });
    }

    res.status(200).json(catelogBook);
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

const updateCatelogBook = async (req, res) => {
  try {
    const catelogBookExist = await CatelogBook.findById(req.params.id);

    if (!catelogBookExist) {
      return res
        .status(404)
        .json({ msg: `No CatelogBook with ${req.params.id}` });
    }

    const catelogBook = await CatelogBook.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json(catelogBook);
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

const deleteCatelogBook = async (req, res) => {
  try {
    const catelogBook = await CatelogBook.findById(req.params.id);

    if (!catelogBook) {
      return res
        .status(404)
        .json({ msg: `No CatelogBook with ${req.params.id}` });
    }

    await CatelogBook.findByIdAndDelete(req.params.id);

    res.status(200).json({ msg: "Successfully delete CatelogBook" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

const countDocuments = async (req, res) => {
  try {
    const count = await CatelogBook.countDocuments();

    res.status(200).json(count);
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

module.exports = {
  getAllCatelogBook,
  createCatelogBook,
  getCatelogBook,
  updateCatelogBook,
  deleteCatelogBook,
  countDocuments,
  getCatelogBookByVendor
};
