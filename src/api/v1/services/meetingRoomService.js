const createError = require('http-errors');
const meetingRoomModel = require('../models/meetingRoomModel');
const { ResponseWrapper, Pagination } = require('../helpers/responseWrapper');

const getAllMeetingRoom = async () => {
    const rooms = await meetingRoomModel.find();
    return rooms;
};

const createMeetingRoom = async ({ roomName, capacity, location, status }) => {
    // store 1 room in mongodb
    const meetingRoom = await meetingRoomModel.create({
        roomName, capacity, location, status
    });

    return meetingRoom;
};

const updateStateMeetingRoom = async (id, newStatus) => {
    const room = await meetingRoomModel.findById(id);
    if (!room) {
        throw createError.NotFound('This meeting room could not be found!');
    }
    // update state 1 room in mongodb
    const rs = await meetingRoomModel.findByIdAndUpdate(id, { status: newStatus }, { new: true });
    return rs;
};

const updateMeetingRoom = async (id, data) => {
    // check room exits
    const room = await meetingRoomModel.findById(id);
    if (!room) {
        throw createError.NotFound('This meeting room could not be found!');
    }
    // update a meeting room in mongodb
    const rs = await meetingRoomModel.findOneAndUpdate({_id: id}, data, { new: true });
    return rs;
};

module.exports = {
    getAllMeetingRoom,
    createMeetingRoom,
    updateStateMeetingRoom,
    updateMeetingRoom,
};