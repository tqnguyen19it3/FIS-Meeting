const Joi = require('joi');

const meetingRoomValidate = (data) => {
    const meetingRoomSchema = Joi.object({
        roomName: Joi.string().required(),
        capacity: Joi.number().required(),
        location: Joi.string().required(),
        status: Joi.boolean().required()
    });
    return meetingRoomSchema.validate(data);
};

module.exports = {
    meetingRoomValidate,
}