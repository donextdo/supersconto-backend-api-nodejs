const Vendor = require('../models/vendor')
const FileService = require('../middleware/s3')

const dotenv = require('dotenv');
dotenv.config();


const DEFAULT_ITEMS_PER_PAGE = 10; // Default items per page value

const getAllVendors = async (req, res, next) => {
    try {
        const vendors = await Vendor.find().select({password: false})

        res.status(200).json(vendors)
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server error" });
    }
}

const getAllVendorsParams = async (req, res) => {
  try {
    const { page = 1, search = '', itemsPerPage = DEFAULT_ITEMS_PER_PAGE } = req.query;
    const options = {
      select: { password: false },
      skip: (page - 1) * itemsPerPage,
      limit: parseInt(itemsPerPage),
    };

    let query = {};
    if (search) {
      query = { fullName: { $regex: search, $options: 'i' } };
    }

    const totalItems = await Vendor.countDocuments(query);
    const venders = await Vendor.find(query, null, options);

    res.status(200).json({
      venders,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalItems / itemsPerPage),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getVendorById = async (req, res, next) => {
    try {
        const id = req.params.id

        const vendor = await Vendor.findById(id)

        if(!vendor) {
            return res.status(404).json({
                Success: false,
                message: `Cannot find vendor with given id`
            })
        }

        res.status(200).json(vendor)
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server error" });
    }
}


const createVendor = async (req, res, next) => {
    try {
        const file = req.file

        let profilePic = null

        const imgURL = await FileService.uploadFile(req, res);
        const bucketUrl = `https://supersconto-images-bucket.s3.eu-west-3.amazonaws.com/${imgURL}`

        if(file) {
            profilePic = bucketUrl
        }
    
        const {profile_pic, ...payload} = req.body
    
        const newVendor = new Vendor({
            ...payload,
            profilePic
        })

        const vendor = await newVendor.save()

        const { password, ...vendorInfo } = vendor._doc

        res.status(201).json(vendorInfo)
    }
    catch(error) {
        res.status(500).json({ message: "Internal Server error" });
    }
}


const updateVendor = async (req, res, next) => {
    try {
        const id = req.params.id

        const vendor = await Vendor.findById(id)

        if(!vendor) {
            return res.status(404).json({
                Success: false,
                message: `Cannot find vendor with given id`
            })
        }

        const file = req.file

        //let profilePic = vendor.profilePic
        let profilePic = null;

        const imgURL = await FileService.uploadFile(req, res);
        const bucketUrl = `https://supersconto-images-bucket.s3.eu-west-3.amazonaws.com/${imgURL}`

        if(file) {
            profilePic = bucketUrl
        }



        const updatedVendor = await Vendor.findByIdAndUpdate(
            id,
            {
                $set: {
                    ...req.body,
                    profilePic
                }
            },
            {
                new: true,
                runValidators: true
            }
        )

        res.status(200).json(updatedVendor)

    }
    catch (error) {
        res.status(500).json({ message: "Internal Server error" });
    }
}


const updateProfilePic = async (req, res, next) => {
    try {
        const id = req.params.id

        const vendor = await Vendor.findById(id)

        if(!vendor) {
            return res.status(404).json({
                Success: false,
                message: `Cannot find vendor with given id`
            })
        }

        const file = req.file

        if(!file) {
            return res.status(400).json({
                Success: false,
                message: `No file in the request`
            })
        }

        const imgURL = await FileService.uploadFile(req, res);
        const profilePic = `https://supersconto-images-bucket.s3.eu-west-3.amazonaws.com/${imgURL}`

        const updatedVendor = await Vendor.findByIdAndUpdate(
            id,
            {
                $set : {
                    profilePic: profilePic
                }
            },
            {
                new: true
            }
        )

        const { password, ...vendorInfo } = updatedVendor._doc

        res.status(200).json(vendorInfo)

    }
    catch (error) {
        res.status(500).json({ message: "Internal Server error" });
    }
}


const deleteVendor = async (req, res, next) => {
    try {
        const id = req.params.id

        const vendor = await Vendor.findById(id)

        if(!vendor) {
            return res.status(404).json({
                Success: false,
                message: `Cannot find vendor with given id`
            })
        }

        await Vendor.findByIdAndDelete(id)

        res.status(200).json({
            success: true,
            message: `Vendor deleted succussfully`
        })
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server error" });
    }
}


const countVendors = async (req, res, next) => {
    try {

        const count = await Vendor.countDocuments()
        res.status(200).json(count)

    } catch (error) {
        res.status(500).json(error)
    }
}


module.exports = {
    getAllVendors,
    getVendorById,
    createVendor,
    updateVendor,
    updateProfilePic,
    deleteVendor,
    countVendors,
    getAllVendorsParams
}