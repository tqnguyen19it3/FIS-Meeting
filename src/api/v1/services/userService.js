const createError = require('http-errors');
const userModel = require('../models/userModel');

const getAllUser = async () => {
    const users = await userModel.find().select('-password');
    return users;
};

module.exports = {
    getAllUser,
};