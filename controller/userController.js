const handler = require("./handler/handlerFactory");

const Users = require('./../models/userModels');

exports.createUser = handler.createOne(Users);

exports.getAllUser = handler.getAll(Users); 

exports.getUser = handler.getOne(Users);

exports.updateUser = handler.updateOne(Users, 'user');

exports.deleteUser = handler.deleteOne(Users, 'user');
