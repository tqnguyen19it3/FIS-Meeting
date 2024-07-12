const express = require('express');
const router = express.Router();

//---------------- Controllers ----------------
const userController = require('../../controllers/userController');

//---------------- Middleware -----------------
const authMiddlewares = require('../../middlewares/authMiddleware');

//---------------- Routes ----------------
router.use('/get-user-list', [authMiddlewares.isAuthentication], userController.getListUser);

module.exports = router;