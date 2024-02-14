const ApiError = require("./../utils/apiError");
const SubCategory = require("./../models/subCategoryModel");
const handler = require('./handler/handlerFactory');

exports.createSubCategory = handler.createOne(SubCategory)

exports.getSubCategoryById = handler.getOne(SubCategory);
exports.updateSubCategory = handler.updateOne(SubCategory , 'subCategory')

exports.getAllSubCategories = handler.getAll(SubCategory);

exports.deleteSubCategory = handler.deleteOne(SubCategory , 'subCategory')
