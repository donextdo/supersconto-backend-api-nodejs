const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  userName: {
    type: String,
    required: true
  },

  email: {
    type: String,
    unique: true,
    required: true
  },

  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  },
  displayName: {
    type: String,
    required: false
  },

  isFavourite: {},

  billingAddress: {
    type: 
      {
        billingFirstName : { type: String, required : false},
        billingLastName : { type: String, required : false},
        billingCompanyName : { type: String, required : false},
        billingPhone: { type: String, required: false, trim: true },
        street: { type: String, required: false },
        apartment: { type: String, required: false},
        town: { type: String, required: false },
        state: { type: String, required: false },
        country: { type: String, required: false },
        zipCode: { type: String, required: false },
        billingEmail: { type: String, required: false },
      },
    
    required: false,
  },

  shippingAddress: {
    type: 
      {
        shippingFirstName : { type: String , required: false},
        shippingLastName : { type:String , required: false},
        shippingCompanyName : {type : String , required : false},
        shippingphone: { type: String, required: false, trim: true },
        street: { type: String, required: false},
        apartment: { type: String, required: false},
        town: { type: String, required: false },
        state: { type: String, required: false },
        country: { type: String, required: false },
        zipCode: { type: String, required: false },
        shippingEmail: { type: String, required: false },
      },
    
    required: false,
  },
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
//  {
//   firstName: "",
//   lastName: "",
//   companyName: "",
//   country: "",
//   street: "",
//   town: "",
//   state: "",
//   zipCode: "",
//   phone: "",
// },
