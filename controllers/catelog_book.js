const CatelogBook = require("../models/catelog_book");
const Shop = require("../models/shop");
const CatelogBookPage = require("../models/catelogbook_page");
const CatelogBookPageItem = require("../models/catalog_page_item");
const mongoose = require("mongoose");

const ITEMS_PER_PAGE = 10; // Number of items to show per page

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



const getAllCatelogBookparams = async (req, res) => {
  const {page = 1, entries = ITEMS_PER_PAGE, search = '' } = req.query;

  try {
    let catelogBooks;
    let pagination;
    let query = {};

      if (search) {
        query = {
          ...query,
          title: { $regex: search, $options: 'i' } // Case-insensitive search
        };
      }

      const totalItems = await CatelogBook.countDocuments(query);
      const totalPages = Math.ceil(totalItems / entries);
      const offset = (page - 1) * entries;

      catelogBooks = await CatelogBook.find(query)
        .sort({ _id: -1 })
        .skip(offset)
        .limit(entries)
        .populate({
          path: "shop_id",
        })
        .populate({
          path: "pages",
          select: "page_image",
        });

      pagination = {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalItems,
      };

    res.status(200).json({ catelogBooks, pagination });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};




const createCatelogBook = async (req, res) => {

  try {
    const {shops, ...catalog} = req.body;

    if (!shops || shops?.length === 0 || !catalog) {
      return res.status(400).json({message: "Invalid Shop or Catalog"});
    }

    const shopList = await Shop.find({ _id: { $in: shops } });

    if (!shopList || shopList?.length === 0) {
      return res.status(404).json({message: "Shops not found"});
    }
    const errors = []

    const shopPromise = shopList.map(async (targetShop) => {
      try{
        const newCatalog = await CatelogBook.create({
          ...catalog,
          shop_id: targetShop._id,
        });

        targetShop.catelog_books.push(newCatalog)
        await targetShop.save()
      } catch (e) {
        errors.push(error.message)

      }

      return targetShop
    })

    try {
      const clonedShops = await Promise.all(shopPromise)
      res.json({clonedShops, errors})
    } catch (e) {
      res.status(500).json({message: "Internal Server error", error:e});
    }


  } catch (e) {
    console.log(error);
    res.status(500).json({message: "Internal Server error"});
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
    },{path: "shop_id", select:'_id, shop_name, address'}]);

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
const cloneCatelogBook = async (req, res) => {
  try {
    const {shops, catalogId} = req.body;

    if (!shops || shops?.length === 0 || !catalogId) {
      return res.status(400).json({message: "Invalid Shop or Catalog"});
    }

    const shopList = await Shop.find({ _id: { $in: shops } });

    const catalog = await CatelogBook.findById(catalogId).populate({
      path: "pages",
      populate: {
        path: "items",
      },
    }).lean();

    if (!catalog || !shopList || shopList?.length === 0) {
        return res.status(404).json({message: "Shops or Catalog not found"});
    }
    const errors = []
    const shopPromise = shopList.map(async (targetShop) => {

      const {pages, ...targetCatalog} = catalog;

      const newCatalog = await CatelogBook.create({
        ...targetCatalog,
        shop_id: targetShop._id,
        _id: new mongoose.Types.ObjectId(),
      });

      const pagePromises = pages.map(async (page, index) => {
        const newPage = await CatelogBookPage.create({
          ...page,
          shop_id: targetShop._id,
          catelog_book_id: newCatalog._id,
          _id: new mongoose.Types.ObjectId(),
        });

        const itemPromises = page.items.map(async (item, index) => {
          return await CatelogBookPageItem.create({
            ...item,
            shop_id: targetShop._id,
            catelog_book_id: newCatalog._id,
            catelog_page_id: newPage._id,
            quantity: 0,
            _id: new mongoose.Types.ObjectId(),
          });
        });

        try {
          const items = await Promise.all(itemPromises);
          newPage.items = items.map(i => i._id);
          await newPage.save();
        } catch (error) {
          console.log(error);
          errors.push(error.message)
        }

        return newPage;
      });

      try {
        const pages = await Promise.all(pagePromises);
        newCatalog.pages = pages.map(i => i._id);
        await newCatalog.save();
        targetShop.catelog_books.push(newCatalog)
        await targetShop.save()
      } catch (error) {
        console.log(error);
        errors.push(error.message)
      }

      return targetShop


    })

    try {
      const clonedShops = await Promise.all(shopPromise)
      res.json({clonedShops, errors})
    } catch (e) {
      res.status(500).json({message: "Internal Server error", error:e});
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Internal Server error"});
  }

}

module.exports = {
  getAllCatelogBook,
  createCatelogBook,
  getCatelogBook,
  updateCatelogBook,
  deleteCatelogBook,
  countDocuments,
  getCatelogBookByVendor,
  getAllCatelogBookparams,
  cloneCatelogBook
};
