const createError = require('http-errors');
const userModel = require('../models/userModel');

const checkUserExist = async (id) => {
    const user = await userModel.findById(id);
    if (!user) {
        throw createError.NotFound('This user could not be found!');
    }
    return true;
}

const getAllUser = async () => {
    const users = await userModel.find().select('-password');
    return users;
};

module.exports = {
    getAllUser,
    checkUserExist
};