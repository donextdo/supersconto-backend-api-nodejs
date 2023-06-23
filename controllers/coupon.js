const Coupon = require("../models/coupon");

const addCoupon = async (req, res) => {
  const id = req.body.id;
  const coupon_code = req.body.coupon_code;
  const date = new Date();
  const expiredate = req.body.expiredate;
  const dicount_amount = req.body.dicount_amount;

  const coupon = new Coupon({
    id,
    coupon_code,
    date,
    expiredate,
    dicount_amount,
  });
  try {
    let response = await coupon.save();
    if (response) {
      return res.status(201).send({ message: "New Coupen Inserted" });
    } else {
      return res.status(500).send({ message: "Internal server error" });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: "Error while saving coupen" });
  }
};

const getAllCoupen = async (req, res) => {
  try {
    let coupons = await Coupon.find();
    if (coupons) {
      return res.json(coupons);
    } else {
      return res
        .status(404)
        .send({ message: "Error occured when retrieving coupons" });
    }
  } catch (err) {
    return res.status(500).send({ message: "Internal server error" });
  }
};

const getCouponById = async (req, res) => {
  const coupon_code = req.params.coupon_code;
  //console.log("data", coupenId);

  try {
    let response = await Coupon.findOne({ coupon_code: coupon_code });
    // console.log("response", response);
    if (response) {
      return res.json(response);
    } else {
      return res.status(404).send({ message: "No such coupon found" });
    }
  } catch (err) {
    return res.status(500).send({ message: "Internal server error" });
  }
};

const updateCoupen = async (req, res) => {
  const Id = req.params.id;

  let coupenUpdate = {
    id: Id,
    coupon_code: req.body.coupon_code,
    date: req.body.date,
    expiredate: req.body.expiredate,
    dicount_amount: req.body.dicount_amount,
  };

  try {
    const response = await Coupon.findOneAndUpdate({ id: Id }, coupenUpdate);

    if (response) {
      return res.status(200).send({ message: "Successfully updated Product " });
    } else {
      return res.status(500).send({ message: "Internal server error" });
    }
  } catch (err) {
    console.log("errror", err);
    return res.status(400).send({ message: "Unable to update" });
  }
};

const deleteCoupen = async (req, res) => {
  const Id = req.params.id;
  try {
    const response = await Coupon.findByIdAndDelete({ id: Id });
    if (response) {
      return res
        .status(204)
        .send({ message: "Successfully deleted a Request" });
    } else {
      return res.status(500).send({ message: "Internal server error" });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(400).send({ message: "Could not delete the request" });
  }
};
module.exports = {
  addCoupon,
  getAllCoupen,
  getCouponById,
  updateCoupen,
  deleteCoupen,
};
