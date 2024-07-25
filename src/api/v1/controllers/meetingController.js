const createError = require('http-errors');
const { meetingValidate, meetingStateValidate } = require('../validations/meetingValidate');
const meetingService = require('../services/meetingService');
const { ResponseWrapper, Pagination } = require('../helpers/responseWrapper');

// [GET] / get meeting list
exports.allMeeting = async (req, res, next) => {
    try {
        const meetings = await meetingService.getAllMeeting();
        // Assume pagination
        const pagination = new Pagination(1, 10, meetings.length);
        return res.status(200).json(new ResponseWrapper('Lấy danh sách cuộc họp thành công!', meetings, null, pagination));
    } catch (error) {
        next(error);
    }
}

// [GET] / get meeting list by week
exports.allMeetingByWeek = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        const meetings = await meetingService.getMeetingByWeek(startDate, endDate);
        // Assume pagination
        const pagination = new Pagination(1, 10, meetings.length);
        return res.status(200).json(new ResponseWrapper('Lấy danh sách cuộc họp thành công!', meetings, null, pagination));
    } catch (error) {
        next(error);
    }
}

// [GET] / get meeting list by day
exports.allMeetingByDay = async (req, res, next) => {
    try {
        const date = req.query.date;
        const meetings = await meetingService.getMeetingByDay(date);
        // Assume pagination
        const pagination = new Pagination(1, 10, meetings.length);
        return res.status(200).json(new ResponseWrapper('Lấy danh sách cuộc họp thành công!', meetings, null, pagination));
    } catch (error) {
        next(error);
    }
}

// [GET] / get available meeting times during the day
exports.allAvailableMeetingTime = async (req, res, next) => {
    try {
        const date = req.query.date;
        const availableMeetingTimes = await meetingService.getAvailableMeetingTime(date);
        return res.status(200).json(new ResponseWrapper('Lấy thời gian họp có sẵn trong ngày thành công!', availableMeetingTimes , null, null));
    } catch (error) {
        next(error);
    }
}

// [GET] / get meeting by id
exports.getMeetingById = async (req, res, next) => {
    try {
        const meeting = await meetingService.getMeetingById(req.params.id);
        return res.status(200).json(new ResponseWrapper('Lấy chi tiết cuộc họp thành công!', meeting, null, null));
    } catch (error) {
        next(error);
    }
}

// [POST] / add meeting
exports.saveMeeting = async (req, res, next) => {
    try {
        // validate all fields
        const { error } = meetingValidate(req.body);
        if(error){
            throw createError(error.details[0].message);
        }

        // store 1 meeting in mongodb from Service
        const meeting = await meetingService.createMeeting(req.payload._id, { ...req.body });
       
        return res.status(200).json(new ResponseWrapper('Tạo cuộc họp thành công!', meeting, null, null));

    } catch (error) {
        next(error);
    }
}

// [POST] / create meeting with participant
exports.createMeetingWithParticipants = async (req, res, next) => {
    try {
        const { participantIDs, ...meetingData } = req.body;
        // validate all fields
        const { error } = meetingValidate(meetingData);
        if(error){
            throw createError(error.details[0].message);
        }
        // const author = req.payload._id //nguoi tao meeting
        const author = '668f944bdfdf1423c659106d'; //admin
        const meetingWithParticipants = await meetingService.createMeetingWithParticipants(author, meetingData, participantIDs);

        return res.status(200).json(new ResponseWrapper('Tạo cuộc họp thành công!', meetingWithParticipants, null, null));

    } catch (error) {
        next(error);
    }
}

// [PATCH] / UPDATE STATE Meeting
exports.updateStateMeeting = async (req, res, next) => {
    try {
        const newStatus = req.body.status;
        // validate all fields
        const { error } = meetingStateValidate(req.body);
        if(error){
            throw createError(error.details[0].message);
        }
        // update state a meeting in mongodb from Service
        const response = await meetingService.updateStateMeeting(req.params.id, newStatus);
        return res.status(200).json(new ResponseWrapper('Cập nhật trạng thái cuộc họp thành công!', response, null, null));
    } catch (err) {
        next(err);
    }
}

// [PUT] / UPDATE Meeting
exports.updateMeeting = async (req, res, next) => {
    try {
        const { error } = meetingValidate(req.body);
        if(error){
            throw createError(error.details[0].message);
        }
        // update a meeting in mongodb from Service
        const response = await meetingService.updateMeeting(req.params.id, req.body);

        return res.status(200).json(new ResponseWrapper('Cập nhật cuộc họp thành công!', response, null, null));
    } catch (error) {
        next(error);
    }
};

// [DELETE] / SOFT DELETE MEETING
exports.softDelMeeting = async (req, res, next) => {
    try {
        await meetingService.softDeleteMeeting(req.params.id);

        return res.status(200).json(new ResponseWrapper('Cuộc họp đã được đưa vào thùng rác!', null, null, null));
    } catch (err) {
        next(err);
    }
}

// [GET] / list meeting from trash
exports.trashMeeting = async (req, res, next) => {
    try {
        const meets = await meetingService.getSoftDelMeeting();
        // Assume pagination
        const pagination = new Pagination(1, 10, meets.length);
        return res.status(200).json(new ResponseWrapper('Lấy danh sách cuộc họp trong thùng rác thành công!', meets, null, pagination));
    } catch (error) {
        next(error);
    }
}

// [PATCH] / Restore Meeting from trash
exports.restoreMeeting = async (req, res, next) => {
    try {
        // update deleted field = false in mongodb from Service
        const response = await meetingService.restoreMeeting(req.params.id);

        return res.status(200).json(new ResponseWrapper('Khôi phục thành công cuộc họp!', response, null, null));
    } catch (err) {
        next(err);
    }
}

// [DELETE] / DESTROY MEETING
exports.destroyMeeting = async (req, res, next) => {
    try {
        await meetingService.destroyMeeting(req.params.id);

        return res.status(200).json(new ResponseWrapper('Xóa thành công cuộc họp!', null, null, null));
    } catch (err) {
        next(err);
    }
}


