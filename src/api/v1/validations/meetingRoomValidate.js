const Joi = require('joi');

const meetingRoomValidate = (data) => {
    const meetingRoomSchema = Joi.object({
        roomName: Joi.string().required().messages({
            'string.base': `Tên phòng họp phải là một loại văn bản`,
            'string.empty': `Tên phòng họp không thể là trường trống`,
            'any.required': `Tên phòng họp là bắt buộc`
        }),
        capacity: Joi.number().required().messages({
            'number.base': `Sức chứa phòng họp phải là một số`,
            'number.empty': `Sức chứa phòng họp không thể là trường trống`,
            'any.required': `Sức chứa phòng họp là bắt buộc`
        }),
        location: Joi.string().required().messages({
            'string.base': `Địa điểm phòng họp phải là một loại văn bản`,
            'string.empty': `Địa điểm phòng họp không thể là trường trống`,
            'any.required': `Địa điểm phòng họp là bắt buộc`
        }),
        status: Joi.boolean().required().messages({
            'boolean.base': `Trạng thái phòng họp phải là một giá trị đúng/sai`,
            'boolean.empty': `Trạng thái phòng họp không thể là trường trống`,
            'any.required': `Trạng thái phòng họp là bắt buộc`
        })
    });
    return meetingRoomSchema.validate(data);
};

module.exports = {
    meetingRoomValidate,
}