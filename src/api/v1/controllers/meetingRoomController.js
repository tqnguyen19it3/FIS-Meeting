const createError = require('http-errors');
const { meetingRoomValidate } = require('../validations/meetingRoomValidate');
const meetingRoomService = require('../services/meetingRoomService');
const { ResponseWrapper, Pagination } = require('../helpers/responseWrapper');

// [GET] / list meeting room
exports.allMeetingRoom = async (req, res, next) => {
    try {
        const rooms = await meetingRoomService.getAllMeetingRoom();
        // Assume pagination
        const pagination = new Pagination(1, 10, rooms.length);
        return res.status(200).json(new ResponseWrapper('Get meeting room list successfully!', rooms, null, pagination));
    } catch (error) {
        next(error);
    }
}

// [GET] / get meeting room by id
exports.getMeetingRoomById = async (req, res, next) => {
    try {
        const room = await meetingRoomService.getMeetingRoomById(req.params.id);
        // Assume pagination
        return res.status(200).json(new ResponseWrapper('Get meeting room by id successfully!', room, null, null));
    } catch (error) {
        next(error);
    }
}

// [POST] / add meeting room
exports.saveMeetingRoom = async (req, res, next) => {
    try {
        const { roomName, capacity, location, status } = req.body;

        // validate all fields
        const { error } = meetingRoomValidate(req.body);
        if(error){
            throw createError(error.details[0].message);
        }

        // store 1 meeting room in mongodb from Service
        const meetingRoom = await meetingRoomService.createMeetingRoom({ roomName, capacity, location, status });
       
        return res.status(200).json(new ResponseWrapper('Add meeting room Successfully!', meetingRoom, null, null));

    } catch (error) {
        next(error);
    }
}

// [PATCH] / UPDATE STATE MeetingRoom
exports.updateStateMeetingRoom = async (req, res, next) => {
    try {
        // update state 1 meeting room in mongodb from Service
        const response = await meetingRoomService.updateStateMeetingRoom(req.params.id, req.body.meetingRoomStatus);

        return res.status(200).json(new ResponseWrapper('Update meeting room state successfully!', response, null, null));
    } catch (err) {
        next(err);
    }
}

// [PUT] / UPDATE MeetingRoom
exports.updateMeetingRoom = async (req, res, next) => {
    try {
        const { error } = meetingRoomValidate(req.body);
        if(error){
            throw createError(error.details[0].message);
        }
        // update a meeting room in mongodb from Service
        const response = await meetingRoomService.updateMeetingRoom(req.params.id, req.body);

        return res.status(200).json(new ResponseWrapper('Update meeting room successfully!', response, null, null));
    } catch (error) {
        next(error);
    }
};

// [DELETE] / SOFT DELETE MEETING ROOM
exports.softDelMeetingRoom = async (req, res, next) => {
    try {
        await meetingRoomService.softDeleteMeetingRoom(req.params.id);

        return res.status(200).json(new ResponseWrapper('Move the meeting room to the trash successfully!', null, null, null));
    } catch (err) {
        next(err);
    }
}

// [GET] / list meeting room from trash
exports.trashMeetingRoom = async (req, res, next) => {
    try {
        const rooms = await meetingRoomService.getSoftDelMeetingRoom();
        // Assume pagination
        const pagination = new Pagination(1, 10, rooms.length);
        return res.status(200).json(new ResponseWrapper('Get meeting room list from trash successfully!', rooms, null, pagination));
    } catch (error) {
        next(error);
    }
}

// [PATCH] / Restore MeetingRoom from trash
exports.restoreMeetingRoom = async (req, res, next) => {
    try {
        // update deleted field = false in mongodb from Service
        const response = await meetingRoomService.restoreMeetingRoom(req.params.id);

        return res.status(200).json(new ResponseWrapper('Restore the meeting room from the trash successfully!', response, null, null));
    } catch (err) {
        next(err);
    }
}

// [DELETE] / DESTROY MEETING ROOM
exports.destroyMeetingRoom = async (req, res, next) => {
    try {
        await meetingRoomService.destroyMeetingRoom(req.params.id);

        return res.status(200).json(new ResponseWrapper('Destroy the meeting room from trash successfully!', null, null, null));
    } catch (err) {
        next(err);
    }
}


