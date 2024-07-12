const express = require('express');
const router = express.Router();

//---------------- Controllers ----------------
const meetingRoomController = require('../../controllers/meetingRoomController');

// //---------------- Middleware -----------------
const authMiddlewares = require('../../middlewares/authMiddleware');

// //---------------- Routes ----------------
router.post('/save-meetingRoom', [authMiddlewares.isAuthentication], meetingRoomController.saveMeetingRoom);
router.get('/get-meeting-room-list', [authMiddlewares.isAuthentication], meetingRoomController.allMeetingRoom);
router.patch('/update-state-meeting-room/:id', [authMiddlewares.isAuthentication], meetingRoomController.updateStateMeetingRoom);
router.put('/update-meeting-room/:id', [authMiddlewares.isAuthentication], meetingRoomController.updateMeetingRoom);
// router.delete('/soft-delete-meeting-room/:id', [authMiddlewares.isAuthentication], meetingRoomController.softDelMeetingRoom);
// router.get('/trash-meeting-room', [authMiddlewares.isAuthentication], meetingRoomController.trashMeetingRoom);
// router.patch('/restore-meeting-room/:id', [authMiddlewares.isAuthentication], meetingRoomController.restoreMeetingRoom);
// router.delete('/destroy-meeting-room/:id', [authMiddlewares.isAuthentication], meetingRoomController.destroyMeetingRoom);


module.exports = router;