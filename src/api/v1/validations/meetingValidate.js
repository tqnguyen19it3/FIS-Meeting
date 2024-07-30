const Joi = require('joi');

const meetingValidate = (data) => {
    const meetingSchema = Joi.object({
        meetingName: Joi.string().required().messages({
            'string.base': `Tên cuộc họp phải là một loại văn bản`,
            'string.empty': `Tên cuộc họp không thể là trường trống`,
            'any.required': `Tên cuộc họp là bắt buộc`
        }),
        description: Joi.string().required().messages({
            'string.base': `Mô tả cuộc họp phải là một loại văn bản`,
            'string.empty': `Mô tả cuộc họp không thể là trường trống`,
            'any.required': `Mô tả cuộc họp là bắt buộc`
        }),
        department: Joi.string().required().messages({
            'string.base': `Phòng ban phải là một loại văn bản`,
            'string.empty': `Phòng ban không thể là trường trống`,
            'any.required': `Phòng ban là bắt buộc`
        }),
        startTime: Joi.date().iso().greater('now').required().messages({
            'date.base': `Thời gian bắt đầu phải là một ngày hợp lệ`,
            'date.format': `Thời gian bắt đầu phải ở định dạng ISO`,
            'date.greater': `Thời gian bắt đầu là bắt buộc và phải lớn hơn thời gian hiện tại`,
            'any.required': `Thời gian bắt đầu là bắt buộc`
        }),
        endTime: Joi.date().iso().greater(Joi.ref('startTime')).required().messages({
            'date.base': `Thời gian kết thúc phải là một ngày hợp lệ`,
            'date.format': `Thời gian kết thúc phải ở định dạng ISO`,
            'date.greater': `Vui lòng chọn đủ thông tin thời gian cho cuộc họp`,
            'any.required': `Thời gian kết thúc là bắt buộc`
        }),
        status: Joi.string().valid('scheduled', 'ongoing', 'completed', 'cancelled').required().messages({
            'string.base': `Trạng thái phải là một loại văn bản`,
            'any.only': `Trạng thái chỉ có thể là một trong các giá trị: scheduled, ongoing, completed, cancelled`,
            'any.required': `Trạng thái là bắt buộc`
        }),
        roomId: Joi.string().required().messages({
            'string.base': `Phòng họp phải là một loại văn bản`,
            'string.empty': `Phòng họp không thể là trường trống`,
            'any.required': `Phòng họp là bắt buộc, bạn cần chọn phòng họp`
        })
    });
    return meetingSchema.validate(data);
};

const meetingStateValidate = (data) => {
    const meetingSchema = Joi.object({
        status: Joi.string().valid('scheduled', 'ongoing', 'completed', 'cancelled').required().messages({
            'string.base': `Trạng thái phải là một loại văn bản`,
            'any.only': `Trạng thái chỉ có thể là một trong các giá trị: scheduled, ongoing, completed, cancelled`,
            'any.required': `Trạng thái là bắt buộc`
        })
    });
    return meetingSchema.validate(data);
};

module.exports = {
    meetingValidate,
    meetingStateValidate
}