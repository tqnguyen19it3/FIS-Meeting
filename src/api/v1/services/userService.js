const createError = require('http-errors');
const userModel = require('../models/userModel');

const getUserById = async (id) => {
    const user = await userModel.findById(id).select('-password');
    if (!user) {
        throw createError.NotFound('This user could not be found!');
    }
    return user;
}

const getAllUser = async () => {
    const users = await userModel.find().select('-password');
    return users;
};

module.exports = {
    getAllUser,
    getUserById
};