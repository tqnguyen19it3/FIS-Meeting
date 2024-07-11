const createError = require('http-errors');
const { userRegisterValidate, userLoginValidate } = require('../validations/authValidate');
const authService = require('../services/authService');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../helpers/jwt_service');
const redisClient = require('../../../config/db/redis');
const { ResponseWrapper } = require('../helpers/responseWrapper');


// [POST] / register
exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // validate all fields
        const { error } = userRegisterValidate(req.body);
        if(error){
            throw createError(error.details[0].message);
        }

        // store 1 user in mongodb from authService
        const user = await authService.createUser({ name, email, password });
       
        return res.status(200).json(new ResponseWrapper('Register Successfully!', user, null, null));

    } catch (error) {
        next(error);
    }
}

// [POST] / login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // validate all fields
        const { error } = userLoginValidate(req.body);
        if(error){
            throw createError(error.details[0].message);
        }

        const user = await authService.loginUser({ email, password });

        // create jwt when login success
        const payload = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
        const accessTokenUser = await signAccessToken(payload);
        const refreshTokenUser = await signRefreshToken(payload);
        const data = {
            accessTokenUser,
            refreshTokenUser
        };
        return res.status(200).json(new ResponseWrapper('Login successfully!', data, null, null));

    } catch (error) {
        next(error);
    }
}

// [DELETE] / logout
exports.logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if(!refreshToken){
            throw createError.BadRequest();
        } 
        const { _id } = await verifyRefreshToken(refreshToken);
        redisClient.del(_id, (err, reply) => {
            if(err){
                throw createError.InternalServerError();
            } 
            return res.status(200).json(new ResponseWrapper('Logout Successfully!', null, null, null));
        });
    } catch (error) {
        next(error);
    }
}

// [POST] / refresh token
exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if(!refreshToken) throw createError.BadRequest();

        const { _id, name, email, role } = await verifyRefreshToken(refreshToken);
        const accessTokenUser = await signAccessToken({ _id, name, email, role });
        const refreshTokenUser = await signRefreshToken({ _id, name, email, role });

        const data = {
            accessTokenUser,
            refreshTokenUser
        }
        return res.status(200).json(new ResponseWrapper('RefreshToken successfully!', data, null, null));
    } catch (error) {
        next(error);
    }
}

