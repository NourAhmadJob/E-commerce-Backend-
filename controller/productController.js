const multer = require("multer");
const Product = require("./../models/productsModel");
const handler = require("./handler/handlerFactory");
const asynchandler = require("express-async-handler");
const multerStorage = multer.memoryStorage();

const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("Please Uploads images not files", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadProductImage = upload.fields([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

exports.resizedProductImage = asynchandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${imageCoverFileName}`);
    // Save image into our db
    req.body.imageCover = imageCoverFileName;
  }
});

exports.createProduct = handler.createOne(Product);

exports.getAllProduct = handler.getAll(Product);
// 1) Filtering
// const queryStrObj = { ...req.query }; // this means that copy the query but withour editing for the orginal
// const excludesFields = ["page", "limit", "sort", "fields"];
// excludesFields.forEach((field) => delete queryStrObj[field]);

// Apply filteration using [gte , gt , lte , lt]
// let queryString = JSON.stringify(queryStrObj);
// queryString = queryString.replace(
//   /\b(gte|gt|lte|lt)\b/g,
//   (match) => `$${match}`
// );
// 2) Pagination
// const page = req.query.page * 1 || 1;
// const limit = req.query.limit * 1 || 5;
// const skip = (page - 1) * limit;
//  Build query
// let mongooseQuery = Product.find(JSON.parse(queryString));
// .populate({ path: "category", select: "name -_id" })
// .populate({ path: "subcategories" });

// 3) Sorting
// if (req.query.sort) {
//   const sortBy = req.query.sort.split(",").join(" ");
//   mongooseQuery = mongooseQuery.sort(sortBy);
// } else {
//   mongooseQuery = mongooseQuery.sort("-createdAt");
// }
// 4) Field limited  (Frontend choose the data will send in response (title , price, ...))
// if (req.query.fields) {
//   const fieldBy = req.query.fields.split(",").join(" ");
//   mongooseQuery = mongooseQuery.select(fieldBy);
// } else {
//   mongooseQuery = mongooseQuery.select("-__v");
// }

// 5) Search
// if (req.query.keywords) {
//   const query = {};
//   query.$or = [
//     { title: { $regex: req.query.keywords } },
//     { description: { $regex: req.query.keywords, $options: "i" } },
//   ];
//   mongooseQuery = mongooseQuery.find(query);
// }
//  Execute query

exports.getProductById = handler.getOne(Product);

exports.updateProduct = handler.updateOne(Product, "product");

exports.deleteProduct = handler.deleteOne(Product, "product");
