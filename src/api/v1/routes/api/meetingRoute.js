const express = require('express');
const router = express.Router();

//---------------- Controllers ----------------
const meetingController = require('../../controllers/meetingController');

// //---------------- Middleware -----------------
const authMiddlewares = require('../../middlewares/authMiddleware');

// //---------------- Routes ----------------
router.post('/save-meeting', [authMiddlewares.isAuthentication], meetingController.saveMeeting);
router.post('/create-meeting-with-participants', [authMiddlewares.isAuthentication], meetingController.createMeetingWithParticipants);
router.get('/get-meeting-list', [authMiddlewares.isAuthentication], meetingController.allMeeting);
router.get('/get-meeting/:id', [authMiddlewares.isAuthentication], meetingController.getMeetingById);
router.patch('/update-state-meeting/:id', [authMiddlewares.isAuthentication], meetingController.updateStateMeeting);
router.put('/update-meeting/:id', [authMiddlewares.isAuthentication], meetingController.updateMeeting);
router.delete('/soft-delete-meeting/:id', [authMiddlewares.isAuthentication], meetingController.softDelMeeting);
router.get('/trash-meeting', [authMiddlewares.isAuthentication], meetingController.trashMeeting);
router.patch('/restore-meeting/:id', [authMiddlewares.isAuthentication], meetingController.restoreMeeting);
router.delete('/destroy-meeting/:id', [authMiddlewares.isAuthentication], meetingController.destroyMeeting);


module.exports = router;