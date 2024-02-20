const path = require("path");

const express = require("express");
const app = express();
const userRoute = require("./routes/userRoute");
const categoryRoute = require("./routes/categoryRoute");
const ApiError = require("./utils/apiError");
const globalError = require("./middleware/errorMiddleware");
const subCategoryRoute = require("./routes/subCategoryRoute");
const productRoute = require("./routes/productRoute");

// MIDDLEWARE
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
// Routes
app.use("/api/users", userRoute);
app.use("/api/category", categoryRoute);
app.use("/api/subCategory", subCategoryRoute);
app.use("/api/product", productRoute);

app.all("*", (req, res, next) => {
  //Create error and send it to error handling middleware
  //const err = new Error(`Can't find this route : ${req.originalUrl}`)
  //next(err.message);
  next(new ApiError(`Can't find this route : ${req.originalUrl}`, 404));
});

// Global Error handling Middleware
app.use(globalError);

module.exports = app;
