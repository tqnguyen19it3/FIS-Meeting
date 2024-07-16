const userService = require('../services/userService');
const { ResponseWrapper, Pagination } = require('../helpers/responseWrapper');

// [GET] / list user
exports.getListUser = async (req, res, next) => {
    try {
        const users = await userService.getAllUser();
        // Assume pagination
        const pagination = new Pagination(1, 10, users.length);
        return res.status(200).json(new ResponseWrapper('Get user list successfully!', users, null, pagination));
    } catch (error) {
        next(error);
    }
}

// [GET] / get user by id
exports.getUserById = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        return res.status(200).json(new ResponseWrapper('Get user by ID successfully!', user, null, null));
    } catch (error) {
        next(error);
    }
}
