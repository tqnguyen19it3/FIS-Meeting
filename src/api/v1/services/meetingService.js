const createError = require('http-errors');
const moment = require('moment');
const meetingModel = require('../models/meetingModel');
const meetingParticipantModel = require('../models/meetingParticipantModel');
const meetingRoomService = require('../services/meetingRoomService');
const userService = require('../services/userService');
const { sendMailToMetingParticipant } = require('../helpers/sendMail');
const calculateAvailableTimes = require('../utils/calculateAvailableTimes');


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
        throw createError.NotFound('Không tìm thấy cuộc họp này!');
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
    const meetings = await meetingModel.find().sort({ startTime: 1 });
    return meetings;
};

const getMeetingByWeek = async (startDate, endDate) => {
    // Truy vấn các cuộc họp trong khoảng thời gian cụ thể
    const meetings = await meetingModel.find({
        $or: [
            { startTime: { $gte: startDate, $lte: endDate } },  // Cuộc họp bắt đầu trong khoảng thời gian
            { endTime: { $gte: startDate, $lte: endDate } },    // Cuộc họp kết thúc trong khoảng thời gian
            { startTime: { $lte: startDate }, endTime: { $gte: endDate } }  // Cuộc họp bao trùm toàn bộ khoảng thời gian (duration)
        ]
    }).sort({ startTime: 1 });

    return meetings;
};

const getMeetingByWeekAndRoom = async (roomId, startDate, endDate) => {
    // Truy vấn các cuộc họp trong khoảng thời gian cụ thể
    const meetings = await meetingModel.find({
        roomId: roomId,
        $or: [
            { startTime: { $gte: startDate, $lte: endDate } },  // Cuộc họp bắt đầu trong khoảng thời gian
            { endTime: { $gte: startDate, $lte: endDate } },    // Cuộc họp kết thúc trong khoảng thời gian
            { startTime: { $lte: startDate }, endTime: { $gte: endDate } }  // Cuộc họp bao trùm toàn bộ khoảng thời gian (duration)
        ]
    }).sort({ startTime: 1 });

    return meetings;
};

const getMeetingByDay = async (date) => {
    // Truy vấn các cuộc họp trong ngày cụ thể
    const startOfDay = moment(date).startOf('day').toDate();
    const endOfDay = moment(date).endOf('day').toDate();

    const meetings = await meetingModel.find({
      startTime: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ startTime: 1 });

    return meetings;
};

const getMeetingByDayAndRoom = async (roomId, date) => {
    // Truy vấn các cuộc họp trong ngày cụ thể và phòng cụ thể
    const startOfDay = moment(date).startOf('day').toDate();
    const endOfDay = moment(date).endOf('day').toDate();

    const meetings = await meetingModel.find({
      roomId: roomId,
      startTime: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ startTime: 1 });

    return meetings;
};

const getAvailableMeetingTime = async (roomId, date) => {
    // Truy vấn các cuộc họp trong ngày cụ thể
    const meetings = await getMeetingByDayAndRoom(roomId, date);
    // Xác định giờ làm việc trong ngày
    const workingHoursStart = moment(date).hour(9).minute(0).second(0).millisecond(0).toDate();
    const workingHoursEnd = moment(date).hour(18).minute(0).second(0).millisecond(0).toDate();
    if (meetings.length === 0) {
        // Trả về mảng có một phần tử nếu không có cuộc họp nào
        return [{
            roomId,
            start: workingHoursStart,
            end: workingHoursEnd,
            duration: moment(workingHoursEnd).diff(moment(workingHoursStart), 'hours')
        }];
    }
       
    const occupiedTimes = meetings.map((meeting) => ({
        startTime: meeting.startTime,
        endTime: meeting.endTime,
    }));

    const availableMeetingTimes = calculateAvailableTimes(occupiedTimes, workingHoursStart, workingHoursEnd);

    return availableMeetingTimes;
};


//create meeting without participants
const createMeeting = async (authorId, data) => {
    const meetingRoom = await meetingRoomService.getMeetingRoomById(data.roomId);
    const author = await userService.getUserById(authorId);
    
    if(meetingRoom.status && author){
        // Truy vấn các cuộc họp khác trong cùng phòng họp có xung đột thời gian
        const conflictingMeetings = await meetingModel.find({
            roomId: data.roomId, //phong hop
            $or: [ //time
                { startTime: { $lt: data.endTime, $gt: data.startTime } },
                { endTime: { $lt: data.endTime, $gt: data.startTime } },
                { startTime: { $lte: data.startTime }, endTime: { $gte: data.endTime } }
            ]
        });

        // Nếu không có cuộc họp nào xung đột, tạo cuộc họp mới
        if (conflictingMeetings.length === 0) {
            data.userId = authorId;
            const meeting = await meetingModel.create(data);
            return meeting;
        } else {
            throw createError.Conflict("Thời gian họp xung đột với các cuộc họp hiện có");
        }
    } else {
        throw createError.NotFound('Có gì đó không ổn!');
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
            `<p>Bạn đã được mời đến một cuộc họp!</p>`
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
        const rs = await meetingModel.findByIdAndUpdate(id, { status: newStatus }, { new: true });
        return rs;
    }
};

const updateMeeting = async (id, data) => {
    if(await getMeetingById(id) && await meetingRoomService.getMeetingRoomById(data.roomId)){
        const rs = await meetingModel.findOneAndUpdate({_id: id}, data, { new: true });
        return rs;
    }
};

const softDeleteMeeting = async (id) => {
    if(await getMeetingById(id)){
        await meetingModel.delete({ _id: id });
    }
};

const getSoftDelMeeting = async () => {
    const meets = await meetingModel.findWithDeleted({deleted:true})
    return meets;
};

const restoreMeeting = async (id) => {
    const meet = await meetingModel.findOneWithDeleted({ _id: id, deleted: true });
    if (!meet) {
        throw createError.NotFound('Không tìm thấy cuộc họp này trong thùng rác!');
    }
    await meetingModel.restore({ _id: id });
    meet.deleted = false;
    return meet;
};

const destroyMeeting = async (id) => {
    const meeting = await meetingModel.findOneWithDeleted({ _id: id, deleted: true });
    if (!meeting) {
        throw createError.NotFound('Không tìm thấy cuộc họp này trong thùng rác!');
    }
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
    getMeetingById,
    getMeetingByWeek,
    getMeetingByWeekAndRoom,
    getMeetingByDay,
    getMeetingByDayAndRoom,
    getAvailableMeetingTime
}