const Joi = require('joi');

const userRegisterValidate = (data) => {
    const userSchema = Joi.object({
    name: Joi.string().min(6).max(24).required().messages({
        'string.base': `Tên phải là một loại văn bản`,
        'string.empty': `Tên không thể là trường trống`,
        'string.min': `Tên phải có ít nhất 6 ký tự`,
        'string.max': `Tên không thể có nhiều hơn 24 ký tự`,
        'any.required': `Tên là bắt buộc`
    }),
    email: Joi.string().email().required().messages({
        'string.base': `Email phải là một loại văn bản`,
        'string.empty': `Email không thể là trường trống`,
        'string.email': `Email phải là một địa chỉ email hợp lệ`,
        'any.required': `Email là bắt buộc`
    }),
    password: Joi.string().min(6).required().messages({
        'string.base': `Mật khẩu phải là một loại văn bản`,
        'string.empty': `Mật khẩu không thể là trường trống`,
        'string.min': `Mật khẩu phải có ít nhất 6 ký tự`,
        'any.required': `Mật khẩu là bắt buộc`
    }),
    passwordConfirm: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': `Mật khẩu xác nhận phải khớp với mật khẩu`,
        'any.required': `Mật khẩu xác nhận là bắt buộc`
    })
});
    return userSchema.validate(data);
}

const userLoginValidate = (data) => {
    const userSchema = Joi.object({
        email: Joi.string().email().required().messages({
            'string.base': `Email phải là một loại văn bản`,
            'string.empty': `Email không thể là trường trống`,
            'string.email': `Email phải là một địa chỉ email hợp lệ`,
            'any.required': `Email là bắt buộc`
        }),
        password: Joi.string().min(6).required().messages({
            'string.base': `Mật khẩu phải là một loại văn bản`,
            'string.empty': `Mật khẩu không thể là trường trống`,
            'string.min': `Mật khẩu phải có ít nhất 6 ký tự`,
            'any.required': `Mật khẩu là bắt buộc`
        })
    });
    return userSchema.validate(data);
}

module.exports = {
    userRegisterValidate,
    userLoginValidate,
}