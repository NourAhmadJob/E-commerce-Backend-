const Category = require("./../models/categoryModel");
const ApiError = require("./../utils/apiError");
const handler = require("./handler/handlerFactory");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/category");
  },
  filename: function (req, file, cb) {
    // category-${id}-Date.now().jpeg
    const ext = file.mimetype.split("/")[1];
    const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
    cb(null, filename);
  },
});

const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("Please Uploads images not files", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadCategoryImage = upload.single("image");

exports.createCategory = handler.createOne(Category);

exports.getAllCategory = handler.getAll(Category);

exports.getCategoryById = handler.getOne(Category);

exports.deleteCategory = handler.deleteOne(Category, "category");
