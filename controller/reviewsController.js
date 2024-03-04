const Review = require("./../models/reviewModel");
const handler = require("./handler/handlerFactory");

exports.createReview = handler.createOne(Review);
exports.getReview = handler.getAll(Review);
exports.getOneReview = handler.getOne(Review);
exports.updateReview = handler.updateOne(Review, "review");
exports.deleteReview = handler.deleteOne(Review, "review");
