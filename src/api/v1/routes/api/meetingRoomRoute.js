const express = require('express');
const router = express.Router();

//---------------- Controllers ----------------
const meetingRoomController = require('../../controllers/meetingRoomController');

// //---------------- Middleware -----------------
const authMiddlewares = require('../../middlewares/authMiddleware');

// //---------------- Routes ----------------
// router.post('/save-meeting-room', [authMiddlewares.isAuthentication], meetingRoomController.saveMeetingRoom);
// router.get('/get-meeting-room-list', [authMiddlewares.isAuthentication], meetingRoomController.allMeetingRoom);
// router.get('/get-meeting-room/:id', [authMiddlewares.isAuthentication], meetingRoomController.getMeetingRoomById);
// router.patch('/update-state-meeting-room/:id', [authMiddlewares.isAuthentication], meetingRoomController.updateStateMeetingRoom);
// router.put('/update-meeting-room/:id', [authMiddlewares.isAuthentication], meetingRoomController.updateMeetingRoom);
// router.delete('/soft-delete-meeting-room/:id', [authMiddlewares.isAuthentication], meetingRoomController.softDelMeetingRoom);
// router.get('/trash-meeting-room', [authMiddlewares.isAuthentication], meetingRoomController.trashMeetingRoom);
// router.patch('/restore-meeting-room/:id', [authMiddlewares.isAuthentication], meetingRoomController.restoreMeetingRoom);
// router.delete('/destroy-meeting-room/:id', [authMiddlewares.isAuthentication], meetingRoomController.destroyMeetingRoom);


router.post('/save-meeting-room', meetingRoomController.saveMeetingRoom);
router.get('/get-meeting-room-list', meetingRoomController.allMeetingRoom);
router.get('/get-meeting-room/:id', meetingRoomController.getMeetingRoomById);
router.patch('/update-state-meeting-room/:id', meetingRoomController.updateStateMeetingRoom);
router.put('/update-meeting-room/:id', meetingRoomController.updateMeetingRoom);
router.delete('/soft-delete-meeting-room/:id', meetingRoomController.softDelMeetingRoom);
router.get('/trash-meeting-room', meetingRoomController.trashMeetingRoom);
router.patch('/restore-meeting-room/:id', meetingRoomController.restoreMeetingRoom);
router.delete('/destroy-meeting-room/:id', meetingRoomController.destroyMeetingRoom);


module.exports = router;