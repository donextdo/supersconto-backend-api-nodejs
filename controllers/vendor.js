const Vendor = require('../models/vendor')

const getAllVendors = async (req, res) => {
    try {
        let vendors = await Vendor.find().sort({_id: -1});
        res.status(200).json(vendors);
    } catch (error) {
        res.status(500).json(error);
    }
};

const createVendor = async (req, res) => {
    try {
        let newVendor = new Vendor(req.body);
        let savedVendor = await newVendor.save();
        res.status(201).json(savedVendor);
    } catch (error) {
        res.status(500).json(error);
    }
};

const updateVendor = async (req, res) => {
    try {
        let updatedVendor = await Vendor.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
        res.status(200).json(updatedVendor);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteVendor = async (req, res) => {
    try {
        let removedVendor = await Vendor.findOneAndDelete({ _id: req.params.id });
        res.status(200).json(removedVendor);
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = {
    getAllVendors,
    createVendor,
    updateVendor,
    deleteVendor
}
  