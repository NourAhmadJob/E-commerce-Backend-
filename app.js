const path = require("path");

const express = require("express");
const app = express();
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const categoryRoute = require("./routes/categoryRoute");
const ApiError = require("./utils/apiError");
const globalError = require("./middleware/errorMiddleware");
const subCategoryRoute = require("./routes/subCategoryRoute");
const productRoute = require("./routes/productRoute");
const reviewRoute = require("./routes/reviewsRoute");
const wishlistRoute = require("./routes/wishlistRoute");
const addressRoute = require('./routes/addressRoute');
const couponRoute = require('./routes/couponRoute');
const cartRoute = require('./routes/cartRoute');
// MIDDLEWARE
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/category", categoryRoute);
app.use("/api/subCategory", subCategoryRoute);
app.use("/api/product", productRoute);
app.use("/api/review", reviewRoute);
app.use("/api/wishlist", wishlistRoute);
app.use("/api/coupon", couponRoute);
app.use("/api/address", addressRoute);
app.use("/api/cart", cartRoute);

app.all("*", (req, res, next) => {
  //Create error and send it to error handling middleware
  //const err = new Error(`Can't find this route : ${req.originalUrl}`)
  //next(err.message);
  next(new ApiError(`Can't find this route : ${req.originalUrl}`, 404));
});

// Global Error handling Middleware
app.use(globalError);

module.exports = app;
