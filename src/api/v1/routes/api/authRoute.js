const express = require('express');
const router = express.Router();

//---------------- Controllers ----------------
const authController = require('../../controllers/authController');


//---------------- Routes ----------------
router.post('/register', authController.register);
router.post('/login', authController.login);
router.delete('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);

module.exports = router;