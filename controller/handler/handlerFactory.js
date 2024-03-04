const ApiError = require("./../../utils/apiError");
const asynchandler = require("express-async-handler");
const ApiFeatures = require("./../../utils/apiFeatures");

exports.deleteOne = (Model, smallModel) =>
  asynchandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(
        new ApiError(`Not fount ${smallModel} with this id ${id}`, 404)
      );
    }
    res.status(200).json({
      status: "success",
      message: `${smallModel} deleted successfully`,
    });
  });

exports.updateOne = (Model, smallModel) =>
  asynchandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
      }
    );

    if (!document) {
      return next(
        new ApiError(
          `Not fount ${smallModel} with this id ${req.params.id}`,
          404
        )
      );
    }
    res.status(200).json({
      status: "success",
      message: `Updated ${smallModel} successfully`,
      document,
    });
  });
exports.createOne = (Model) =>
  asynchandler(async (req, res, next) => {
    const newDocument = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: newDocument,
    });
  });

exports.getOne = (Model) =>
  asynchandler(async (req, res, next) => {
    const document = await Model.findById({ _id: req.params.id });
    if (!document) {
      return next(new ApiError(`Not Found document with this id ${id}`, 404));
    }
    res.status(200).json({
      status: "success",
      document,
    });
  });

exports.getAll = (Model) =>
  asynchandler(async (req, res, next) => {
    const apiFeatures = new ApiFeatures(Model.find(), req.query)
      .sort()
      .filter()
      .fieldsLimit()
      .search();
    const document = await apiFeatures.mongooseQuery;

    res.status(200).json({
      status: "success",
      result: document.length,
      document,
    });
  });
