const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegistration, checkValidationResult } = require('../middleware/validation');
const { auth } = require('../middleware/auth');

router.post('/register', validateRegistration, checkValidationResult, authController.register);

router.post('/login', authController.login);

router.post('/change-password', auth, authController.changePassword);

module.exports = router;