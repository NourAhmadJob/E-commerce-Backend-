const Category = require("./../models/categoryModel");
const ApiError = require("./../utils/apiError");
const handler = require("./handler/handlerFactory");

exports.createCategory = handler.createOne(Category);

exports.getAllCategory = handler.getAll(Category);

exports.getCategoryById = handler.getOne(Category);

exports.deleteCategory = handler.deleteOne(Category, "category");
