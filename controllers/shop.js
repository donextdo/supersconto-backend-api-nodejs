const Shop = require("../models/shop");
const mongoose = require("mongoose");

const DEFAULT_ITEMS_PER_PAGE = 10; // Default items per page value

const getAllShops = async (req, res) => {
  try {
    let shops = await Shop.find().sort({ _id: -1 });

    res.status(200).json(shops);
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

const getAllShopsParams = async (req, res) => {
  try {
    const { page = 1, search = '', itemsPerPage = DEFAULT_ITEMS_PER_PAGE } = req.query;
    const options = {
      sort: { _id: -1 },
      skip: (page - 1) * itemsPerPage,
      limit: parseInt(itemsPerPage),
    };

    let query = {};
    if (search) {
      query = {
        $or: [
          { 'shop_name': { $regex: new RegExp(search, 'i') } }, // Case-insensitive search for shop_name
          { 'address.address': { $regex: new RegExp(search, 'i') } }, // Case-insensitive search for address
        ],
      };
    }

    const totalItems = await Shop.countDocuments(query);
    const shops = await Shop.find(query, null, options);

    res.status(200).json({
      shops,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalItems / itemsPerPage),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const createShop = async (req, res) => {
  try {
    if (req.file === undefined) return res.send("you must select a file.");
    const imgPath = `${process.env.IMG_SERVER}/public/images/${req.file.filename}`;
    console.log("image load to publi/image folder : ", imgPath);
    const { logo_img, ...payload } = req.body;

    const newShop = new Shop({
      ...payload,
      logo_img: imgPath,
      coordinates: [payload.longitude, payload.latitude]
    });

    const shop = await newShop.save();

    res.status(200).json(shop);
  } catch (error) {
    console.log("", error);
    res.status(500).json({ message: error.message });
  }
};

const getCheckName = async (req, res) => {
  try {
    const { shop_name } = req.body;

    const shopExists = await Shop.findOne({ shop_name });
    console.log(shopExists)
    
    if (shopExists) {
      return res.status(400).json({ error: 'Shop name already exists' });
  } else {
      return res.status(200).json({ message: 'Shop name is not available' });
  }

  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

const getShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).populate({
      path: "catelog_books",
      populate: {
        path: "pages",
        model: "CatelogBookPage",
        populate: {
          path: "items",
          model: "CatelogBookPageItem",
        },
      },
    });

    if (!shop) {
      return res
        .status(404)
        .json({ msg: `No Shop associate with ${req.params.id}` });
    }

    res.status(200).json(shop);
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

const getShopByVendor = async (req, res) => {
  try {
    const shop = await Shop.find({vendor:new mongoose.Types.ObjectId(req.params.id)}).populate({
      path: "catelog_books",
      populate: {
        path: "pages",
        model: "CatelogBookPage",
        populate: {
          path: "items",
          model: "CatelogBookPageItem",
        },
      },
    });

    if (!shop) {
      return res
        .status(404)
        .json({ msg: `No Shop associate with ${req.params.id}` });
    }

    res.status(200).json(shop);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server error" });
  }
};

const getShopByVendorParms = async (req, res) => {
  try {
    const { page = 1, search = '', itemsPerPage = DEFAULT_ITEMS_PER_PAGE } = req.query;
    const options = {
      sort: { _id: -1 },
      skip: (page - 1) * itemsPerPage,
      limit: parseInt(itemsPerPage),
    };

    const vendorId = new mongoose.Types.ObjectId(req.params.id);
    let query = { vendor: vendorId };

    if (search) {
       query = {
          ...query,
          shop_name: { $regex: search, $options: 'i' } // Case-insensitive search
        };;
    }

    const totalItems = await Shop.countDocuments(query);
    const shops = await Shop.find(query, null, options);

    if (shops.length === 0) {
      return res.status(404).json({ msg: `No Shop associated with ${req.params.id}` });
    }

    res.status(200).json({
      shops,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalItems / itemsPerPage),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};


const updateShop = async (req, res) => {
  try {
    const id = req.params.id;

    const sshop = await Shop.findById(id);


    if (!sshop) {
      return res.status(404).json({
        Success: false,
        message: `Cannot find shop with given id`,
      });
    }
 
    const file = req.file;

    let logo_img = Shop.logo_img;

    if (file) {
      logo_img = `${process.env.IMG_SERVER}/public/images/${file.filename}`;
    }

    const updatedShop = await Shop.findByIdAndUpdate(
      id,
      {
        $set: {
          ...req.body,
          logo_img,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json(updatedShop);
  } catch (error) {
    console.log(error)
    res.status(500).json(error.message);
  }
};

const deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({ msg: `No prodcut with ${req.params.id}` });
    }

    await Shop.findByIdAndDelete(req.params.id);

    res.status(200).json({ msg: "Successfully delete shop" });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server error" });
  }
};

const countDocuments = async (req, res) => {
  try {
    const count = await Shop.countDocuments();
    res.status(200).json(count);
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

module.exports = {
  getAllShops,
  createShop,
  getShop,
  updateShop,
  deleteShop,
  countDocuments,
  getShopByVendor,
  getAllShopsParams,
  getShopByVendorParms,
  getCheckName
};
