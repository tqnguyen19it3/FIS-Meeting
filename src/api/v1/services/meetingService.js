const createError = require('http-errors');
const meetingModel = require('../models/meetingModel');
const meetingRoomService = require('../services/meetingRoomService');
const userService = require('../services/userService');

const checkMeetingExist = async (id) => {
    const meeting = await meetingModel.findById(id);
    if (!meeting) {
        throw createError.NotFound('This meeting could not be found!');
    }
    return true;
}

const getAllMeeting = async () => {
    const meetings = await meetingModel.find();
    return meetings;
};

const createMeeting = async (userId, data) => {
    if(await meetingRoomService.checkMeetingRoomExist(data.roomId) === true && await userService.checkUserExist(userId) === true){
        data.userId = userId;
        // store 1 meeting in mongodb
        const meeting = await meetingModel.create(data);
        return meeting;
    }
};

const updateStateMeeting = async (id, newStatus) => {
    if(await checkMeetingExist(id) === true){
        // update state 1 meeting in mongodb
        const rs = await meetingModel.findByIdAndUpdate(id, { status: newStatus }, { new: true });
        return rs;
    }
};

const updateMeeting = async (id, data) => {
    // check meeting exits
    if(await checkMeetingExist(id) === true && await meetingRoomService.checkMeetingRoomExist(data.roomId) === true){
        // update a meeting in mongodb
        const rs = await meetingModel.findOneAndUpdate({_id: id}, data, { new: true });
        return rs;
    }
};

const softDeleteMeeting = async (id) => {
    // check meeting exits
    if(await checkMeetingExist(id) === true){
        // move a meeting to trash
        await meetingModel.delete({ _id: id });
    }
};

const getSoftDelMeeting = async () => {
    // chỉ lấy các meet nằm trong thùng rác
    const meets = await meetingModel.findWithDeleted({deleted:true})
    return meets;
};

const restoreMeeting = async (id) => {
    const meet = await meetingModel.findOneWithDeleted({ _id: id, deleted: true });
    if (!meet) {
        throw createError.NotFound('This meeting could not be found in trash!');
    }
    await meetingModel.restore({ _id: id });
    meet.deleted = false;
    return meet;
};

const destroyMeeting = async (id) => {
    // check meeting exits
    const meeting = await meetingModel.findOneWithDeleted({ _id: id, deleted: true });
    if (!meeting) {
        throw createError.NotFound('This meeting could not be found in trash!');
    }
    // destroy
    await meetingModel.findOneAndDelete({ _id: id });
};

module.exports = {
    getAllMeeting,
    createMeeting,
    updateStateMeeting,
    updateMeeting,
    softDeleteMeeting,
    getSoftDelMeeting,
    restoreMeeting,
    destroyMeeting,
    checkMeetingExist
}