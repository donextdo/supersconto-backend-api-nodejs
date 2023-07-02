const bcrypt = require("bcrypt");
const { request } = require("express");
const User = require("../models/user");
const auth = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const SECRET_KEY = "your_secret_key";
const EMAIL_FROM = "thisararpg@gmail.com";
const EMAIL_HOST = "smtp.example.com";
const EMAIL_PORT = 587;
const EMAIL_USERNAME = "your_username";
const EMAIL_PASSWORD = "your_password";
const FRONTEND_BASE_URL = "http://localhost:3001/successpage";

//register new user
const register = async (req, res) => {
  const userName = req.body.userName;
  const email = req.body.email;
  const pwd = req.body.password;
  const isFavourite = req.body.isFavourite;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const companyName = req.body.companyName;
  const billingAddress = req.body.billingAddress;
  const shippingAddress = req.body.shippingAddress;

  const salt = bcrypt.genSaltSync(10);
  const password = bcrypt.hashSync(pwd, salt);

  const user = new User({
    userName,
    email,
    password,
    isFavourite,
    firstName,
    lastName,
    companyName,
    billingAddress,
    shippingAddress,
  });

  try {
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      res.status(400).send({ message: "User Already Exists" });
    } else {
      let response = await user.save();

      if (response) {
        // verify email link send
        sendEmailVerification(email);
        // call the verify endpoint
        console.log("process.env.SECRET_KEY : ", SECRET_KEY);
        res.status(201).json({
          message: "Sign-up successful.",
        });
      } else {
        res
          .status(500)
          .json({ message: "Sign-up failed. Please try again later." });
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error while registering a user" });
  }
};

//send email for the verification
const sendEmailVerification = async (email) => {
  const token = jwt.sign({ email }, SECRET_KEY, {
    expiresIn: "1h",
  });
  // const token = "token";
  const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: false,
    auth: {
      user: EMAIL_USERNAME,
      pass: EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const frontendBaseURL = FRONTEND_BASE_URL;
  console.log("verify the email: ", email);
  const verificationEmail = {
    from: EMAIL_FROM,
    to: email,
    subject: "Email Verification",
    html: `
    <p>Please click the following link to verify your email:</p>
    <a href="http://localhost:3000/v1/api/users/verify/${token}">Verify Email</a>
    `,
  };
  console.log(`http://localhost:3000/v1/api/users/verify/${token}`);
  console.log("verify the email: ", verificationEmail);
  try {
    await transporter.sendMail(verificationEmail);
  } catch (error) {
    console.log("error while sending the email: ", error);
    const response = await User.findOneAndUpdate(
      { email },
      { isemailverify: true }
    );
    if (response) {
      console.log("Sign up Done");
    }
  }
};

//verify tocken and update user verify status
const VerifyEmailByUser = async (req, res) => {
  try {
    // Verify the token
    const decodedToken = jwt.verify(req.params.token, process.env.SECRET_KEY);
    console.log("decodedToken: ", decodedToken);
    // Update the user's verification status in your database
    const { email } = decodedToken;
    await User.findOneAndUpdate({ email }, { isemailverify: true });

    // Redirect the user to a success page
    res.redirect(process.env.FRONTEND_BASE_URL);
  } catch (error) {
    console.error("Error during verification:", error);
    res.redirect("/verification/error");
  }
};

//login user
const login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const id = req.params.id;

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(400).send("Invalid email or password.");
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).send("Invalid email or password .");
  }

  const token = auth.sign({ _id: id }, "myprivatekey");

  // res.send(`  ${token}`);
  res.status(200).send({ ...user.toJSON(), token });

  // try{
  //   const user = await User.findOne({ email:email });
  //   console.log(user)
  //   if (user) {
  //     if (user ) {
  //       // const token = auth.generateAccessToken(email);
  //       return res.status(200).send({ ...user.toJSON(), TOKEN_SECRET });
  //     } else {
  //       return res.status(400).send({
  //         message: "Such user does not exist check your credentials ",
  //       });
  //     }
  //   } else {
  //     return res.status(404).send({ message: "Such user does not exist" });
  //   }
  // } catch (err) {
  //   return res
  //     .status(400)
  //     .send({ message: "Such user does not exist check your credentialsadadada" });
  // }
};

const getAllUsers = async (req, res) => {
  try {
    let users = await User.find();
    if (users) {
      return res.json(users);
    } else {
      return res.status(404).send({ message: "Error on retrieving users" });
    }
  } catch (err) {
    return res.status(500).send({ message: "Internal server error" });
  }
};

const getOneUser = async (req, res) => {
  const id = req.params.id;

  try {
    let user = await User.findOne({
      _id: id,
    });
    if (user) {
      return res.json(user);
    } else {
      return res.status(404).send({ message: "No such user found" });
    }
  } catch (err) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

const updateUserPassword = async (req, res) => {
  const id = req.params.id;
  const password = req.params.pwd;

  try {
    const user = await User.findOne({ id });
    if (user) {
      const salt = bcrypt.genSaltSync(10);
      const updatePassword = bcrypt.hashSync(password, salt);

      const newUser = {
        userName: user.userName,
        email: user.email,
        password: updatePassword,
        isFavourite: user.isFavourite,
      };

      try {
        const response = await User.findOneAndUpdate({ _id: id }, newUser);
        if (response) {
          return res
            .status(200)
            .send({ message: "Successfully updated Password" });
        } else {
          return res.status(500).send({ message: "Internal server error" });
        }
      } catch (err) {
        return res
          .status(400)
          .send({ message: "Unable to update recheck your email" });
      }
    } else {
      return res
        .status(404)
        .send({ message: "No such user with entered email" });
    }
  } catch (err) {
    return res.status(404).send({ message: "No such user with entered email" });
  }
};

const addWishList = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    console.log("user", user);
    const products = req.body.wishList;

    const productList = products.map((p) => ({
      productId: p.productId,
      date: p.date,
      front: p.front,
      title: p.title,
      price: p.price,
      quantity: p.quantity,
    }));

    user.wishList.push(...productList);

    await user.save();

    res.status(200).json({ message: "Products added to wishlist" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteFromWishList = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    // Remove the product from the wishlist array
    user.wishList = user.wishList.filter(
      (product) => product.productId !== req.params.productId
    );

    await user.save();

    res.status(200).json({ message: "Product removed from wishlist" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  const id = req.params.id;
  const user = await User.findOne({ _id: id });
  const password = user.password;

  const updateUser = {
    id: req.params.id,
    userName: req.body.userName,
    email: req.body.email,
    password: password,
    isFavourite: req.body.isFavourite,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    displayName: req.body.displayName,
    billingAddress: req.body.billingAddress,
    shippingAddress: req.body.shippingAddress,
  };

  try {
    const response = await User.findOneAndUpdate({ _id: id }, updateUser);
    if (response) {
      return res
        .status(200)
        .send({ message: "Successfully updated User Details" });
    } else {
      return res.status(500).send({ message: "Internal server error" });
    }
  } catch (err) {
    return res
      .status(400)
      .send({ message: "Unable to update recheck your email" });
  }
};

module.exports = {
  register,
  login,
  getAllUsers,
  getOneUser,
  updateUserPassword,
  updateUser,
  VerifyEmailByUser,
  addWishList,
  deleteFromWishList
};
