const createError = require('http-errors');
const meetingModel = require('../models/meetingModel');
const meetingRoomService = require('../services/meetingRoomService');
const userService = require('../services/userService');
const meetingParticipantModel = require('../models/meetingParticipantModel');
const { sendMailToMetingParticipant } = require('../helpers/sendMail');


const addParticipantsToTheMeeting = async (meetingId, participantIDs) => {
    const participantPromises = participantIDs.map(async (participantId) => {
        // check user exits
        // if (await userService.getUserById(participantId)) {
            const newParticipant = new meetingParticipantModel({
                meetingId,
                userId: participantId
            });
            return newParticipant.save();
        // }
    });

    await Promise.all(participantPromises);
}

const getMeetingById = async (id) => {
    const meeting = await meetingModel.findById(id)
                        .populate('userId', 'name email role')
                        .populate('roomId', 'roomName capacity location status deleted')
                        .exec();
    if (!meeting) {
        throw createError.NotFound('This meeting could not be found!');
    }
    // Lấy thông tin người tham gia từ bảng MeetingParticipants
    const participants = await meetingParticipantModel.find({ meetingId: id })
                            .populate('userId', 'name email role')
                            .exec();

    // Trả về cuộc họp với thông tin người tham gia
    return {
        ...meeting.toObject(),
        participants: participants.map(participant => participant.userId)
    };
}

const getAllMeeting = async () => {
    const meetings = await meetingModel.find();
    return meetings;
};

//create meeting without participants
const createMeeting = async (userId, data) => {
    if(await meetingRoomService.getMeetingRoomById(data.roomId) && await userService.getUserById(userId)){
        data.userId = userId;
        // store 1 meeting in mongodb
        const meeting = await meetingModel.create(data);
        return meeting;
    }
};

//create meeting with participants
const createMeetingWithParticipants = async (userId, meetingData, participantIDs) => {
    // create a new meeting
    const meeting = await createMeeting(userId, meetingData);

    // Add participants to the meeting
    await addParticipantsToTheMeeting(meeting._id, participantIDs);

    const meetingInfo = await getMeetingById(meeting._id);

    // Gửi email cho từng người tham gia
    const emailPromises = meetingInfo.participants.map(participant => {
        return sendMailToMetingParticipant(
            participant.email,
            meetingInfo,
            "Meeting",
            `<p>You have been invited to a meeting!</p>`
        );
    });

    await Promise.all(emailPromises);

    // Convert meeting to a plain JavaScript object
    const meetingObject = meeting.toObject();
    meetingObject.participantIDs = participantIDs;

    return meetingObject;
};

const updateStateMeeting = async (id, newStatus) => {
    if(await getMeetingById(id)){
        // update state 1 meeting in mongodb
        const rs = await meetingModel.findByIdAndUpdate(id, { status: newStatus }, { new: true });
        return rs;
    }
};

const updateMeeting = async (id, data) => {
    // check meeting exits
    if(await getMeetingById(id) && await meetingRoomService.getMeetingRoomById(data.roomId)){
        // update a meeting in mongodb
        const rs = await meetingModel.findOneAndUpdate({_id: id}, data, { new: true });
        return rs;
    }
};

const softDeleteMeeting = async (id) => {
    // check meeting exits
    if(await getMeetingById(id)){
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
    createMeetingWithParticipants,
    updateStateMeeting,
    updateMeeting,
    softDeleteMeeting,
    getSoftDelMeeting,
    restoreMeeting,
    destroyMeeting,
    getMeetingById
}