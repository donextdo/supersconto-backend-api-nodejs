const Vendor = require('../models/vendor')


const getAllVendors = async (req, res, next) => {
    try {
        const vendors = await Vendor.find().select({password: false})

        res.status(200).json(vendors)
    }
    catch (error) {
        res.status(500).json(error.message)
    }
}


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
        res.status(500).json(error.message)
    }
}


const createVendor = async (req, res, next) => {
    try {
        const file = req.file

        let profilePic = null

        if(file) {
            profilePic = `${req.protocol}://${req.get('host')}/public/images/${file.filename}`
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
        res.status(500).json(error.message)
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

        const updatedVendor = await Vendor.findByIdAndUpdate(
            id,
            {
                $set: {
                    ...req.body
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
        res.status(500).json(error.message)
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

        const profilePic = `${req.protocol}://${req.get('host')}/public/images/${file.filename}`

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
        res.status(500).json(error.message)
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
        res.status(500).json(error.message)
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
    countVendors
}