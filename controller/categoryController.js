const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asynchandler = require("express-async-handler");
const Category = require("./../models/categoryModel");
const handler = require("./handler/handlerFactory");

const { uploadSingleImage } = require('./../middleware/imageMiddleware');

exports.uploadCategoryImage = uploadSingleImage('image')

exports.resizeImage = asynchandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/category/${filename}`);
 
  // Save image into our db
  req.body.image = filename;

  next();
});

exports.createCategory = handler.createOne(Category);

exports.getAllCategory = handler.getAll(Category);

exports.getCategoryById = handler.getOne(Category);

exports.deleteCategory = handler.deleteOne(Category, "category");
