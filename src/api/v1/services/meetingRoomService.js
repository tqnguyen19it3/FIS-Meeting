const createError = require('http-errors');
const meetingRoomModel = require('../models/meetingRoomModel');

const getAllMeetingRoom = async () => {
    // chỉ lấy các room k nằm trong thùng rác
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

const softDeleteMeetingRoom = async (id) => {
    // check room exits
    const room = await meetingRoomModel.findById(id);
    if (!room) {
        throw createError.NotFound('This meeting room could not be found!');
    }
    // move a meeting room to trash
    await meetingRoomModel.delete({ _id: id });
};

const getSoftDelMeetingRoom = async () => {
    // chỉ lấy các room nằm trong thùng rác
    const rooms = await meetingRoomModel.findWithDeleted({deleted:true})
    return rooms;
};

const restoreMeetingRoom = async (id) => {
    const room = await meetingRoomModel.findOneWithDeleted({ _id: id, deleted: true });
    if (!room) {
        throw createError.NotFound('This meeting room could not be found in trash!');
    }
    await meetingRoomModel.restore({ _id: id });
    room.deleted = false;
    return room;
};

const destroyMeetingRoom = async (id) => {
    // check room exits
    const room = await meetingRoomModel.findOneWithDeleted({ _id: id, deleted: true });
    if (!room) {
        throw createError.NotFound('This meeting room could not be found in trash!');
    }
    // move a meeting room to trash
    await meetingRoomModel.findOneAndDelete({ _id: id });
};

module.exports = {
    getAllMeetingRoom,
    createMeetingRoom,
    updateStateMeetingRoom,
    updateMeetingRoom,
    softDeleteMeetingRoom,
    getSoftDelMeetingRoom,
    restoreMeetingRoom,
    destroyMeetingRoom
};