const createError = require('http-errors');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const genHash = require('../utils/genHash');

const createUser = async ({ name, email, password }) => {
    // check email exits
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        throw createError.Conflict(`Register Failed! ${email} already exists`);
    }
    const hashPassword = await genHash.genHashPassword(password);
    // store 1 user in mongodb
    const user = await userModel.create({
        name,
        email,
        password: hashPassword,
    });

    // Loại bỏ trường 'password' trước khi trả về user
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return userWithoutPassword;
};

const loginUser = async ({ email, password }) => {
    //check user exits
    const user = await userModel.findOne({ email });
    if(!user){
        throw createError.NotFound(`Login Failed! ${email} not registered`);
    }
    //check password
    const isPassValid = bcrypt.compareSync(password, user.password);
    if(!isPassValid){
        throw createError.Unauthorized();
    }
    // Loại bỏ trường 'password' trước khi trả về user
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return userWithoutPassword;
};


module.exports = {
    createUser,
    loginUser,
};
