const Joi = require('joi');

const meetingValidate = (data) => {
    const meetingSchema = Joi.object({
        meetingName: Joi.string().required(),
        description: Joi.string().required(),
        department: Joi.string().required(),
        startTime: Joi.date().iso().greater('now').required(),
        endTime: Joi.date().iso().greater(Joi.ref('startTime')).required(),
        status: Joi.string().valid('scheduled', 'ongoing', 'completed', 'cancelled').required(),
        roomId: Joi.string().required()
    });
    return meetingSchema.validate(data);
};

const meetingStateValidate = (data) => {
    const meetingSchema = Joi.object({
        status: Joi.string().valid('scheduled', 'ongoing', 'completed', 'cancelled').required(),
    });
    return meetingSchema.validate(data);
};

module.exports = {
    meetingValidate,
    meetingStateValidate
}