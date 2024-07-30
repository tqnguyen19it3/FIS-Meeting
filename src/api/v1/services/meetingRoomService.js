const createError = require('http-errors');
const meetingRoomModel = require('../models/meetingRoomModel');

const getMeetingRoomById = async (id) => {
    const room = await meetingRoomModel.findById(id);
    if (!room) {
        throw createError.NotFound('Không tìm thấy phòng họp này!');
    }
    return room;
}

const getAllMeetingRoom = async () => {
    // chỉ lấy các room k nằm trong thùng rác
    const rooms = await meetingRoomModel.find();
    return rooms;
};

const createMeetingRoom = async ({ roomName, capacity, location, status }) => {
    const meetingRoom = await meetingRoomModel.create({
        roomName, capacity, location, status
    });

    return meetingRoom;
};

const updateStateMeetingRoom = async (id, newStatus) => {
    if(await getMeetingRoomById(id)){
        const rs = await meetingRoomModel.findByIdAndUpdate(id, { status: newStatus }, { new: true });
        return rs;
    }
};

const updateMeetingRoom = async (id, data) => {
    if(await getMeetingRoomById(id)){
        const rs = await meetingRoomModel.findOneAndUpdate({_id: id}, data, { new: true });
        return rs;
    }
};

const softDeleteMeetingRoom = async (id) => {
    if(await getMeetingRoomById(id)){
        await meetingRoomModel.delete({ _id: id });
    }
   
};

const getSoftDelMeetingRoom = async () => {
    const rooms = await meetingRoomModel.findWithDeleted({deleted:true})
    return rooms;
};

const restoreMeetingRoom = async (id) => {
    const room = await meetingRoomModel.findOneWithDeleted({ _id: id, deleted: true });
    if (!room) {
        throw createError.NotFound('Không tìm thấy phòng họp này trong thùng rác!');
    }
    await meetingRoomModel.restore({ _id: id });
    room.deleted = false;
    return room;
};

const destroyMeetingRoom = async (id) => {
    const room = await meetingRoomModel.findOneWithDeleted({ _id: id, deleted: true });
    if (!room) {
        throw createError.NotFound('Không tìm thấy phòng họp này trong thùng rác!');
    }
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
    destroyMeetingRoom,
    getMeetingRoomById
};