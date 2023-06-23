const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.set("debug", true);

//search
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");

dotenv = require("dotenv");
console.log({ env: process.env.NODE_ENV });
if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env.development" });
}
const passport = require("passport");
require("./config/auth/auth");

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth-routes/auth-routes');
const shopRouter = require('./routes/shop')
const catelogBookRouter = require('./routes/catelog_book')
const catelogBookPageRouter = require('./routes/catelog_book_page')
const catelogBookItemRouter = require('./routes/catelog_book_page_item')
const vendorRouter = require('./routes/vendor')
const stockRouter = require('./routes/stock')
const orderRouter = require('./routes/order')
const newsRouter = require('./routes/news')
const categoryRoutes = require('./routes/category-route');
const searchRouter = require('./routes/search.route')
const userAuth = require('./routes/user')
const product = require('./routes/product')
const neworder = require('./routes/neworder')
const reviewRouter = require('./routes/review')
const filter = require("./routes/product_filter");
const couponRouter = require('./routes/coupon')



const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/public", express.static(__dirname + "/public"));

app.use('/v1/api', indexRouter);
app.use('/v1/api/auth', authRouter)
app.use('/v1/api/shop', shopRouter)
app.use('/v1/api/catelog/book', catelogBookRouter)
app.use('/v1/api/catelog/page', catelogBookPageRouter)
app.use('/v1/api/catelog/item', catelogBookItemRouter)
app.use('/v1/api/vendor', vendorRouter)
app.use('/v1/api/stock', stockRouter)
app.use('/v1/api/order', orderRouter)
app.use('/v1/api/news', newsRouter)
app.use('/v1/api/category', categoryRoutes);
app.use('/v1/api/search', searchRouter)
app.use('/v1/api/users', userAuth)
app.use('/v1/api/product', product)
app.use('/v1/api/neworder', neworder)
app.use('/v1/api/reviews', reviewRouter)
app.use("/v1/api/filter", filter);
app.use('/v1/api/coupons', couponRouter)



const mongoUri = process.env.MONGO_URI;

mongoose.set("strictQuery", false);
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("DB connection is ready");
  })
  .catch((err) => {
    throw err;
  });

//search
const server = http.createServer(app);
const io = socketIo(server);

async function searchProducts(query) {
  try {
    if (!query) {
      console.error("Invalid search query.");
      return [];
    }
    const response = await axios.get(
      "http://localhost:3000/v1/api/catelog/item/"
    );
    const products = response.data;
    console.log("response , ", response.data);
    if (!products) {
      console.error("Products not found in API response.");
      return [];
    }
    const filteredProducts = products.filter((product) =>
      product.product_name.toLowerCase().includes(query.toLowerCase())
    );
    console.log("filteredProducts : ", filteredProducts);
    return filteredProducts;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}
io.on("connection", (socket) => {
  console.log("A client connected.");

  // Socket.io event listener for search requests
  socket.on("search", async (query) => {
    console.log(`Received search query: ${query}`);

    const results = await searchProducts(query);

    // Send the search results back to the client
    socket.emit("searchResults", results);
  });

  // Socket.io event listener for client disconnections
  socket.on("disconnect", () => {
    console.log("A client disconnected.");
  });
});
const port = 5000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});

module.exports = app;
