const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUserCreation, checkValidationResult } = require('../middleware/validation');
const { auth, adminAuth } = require('../middleware/auth');
router.get('/', adminAuth, userController.getAllUsers);
router.post('/', adminAuth, validateUserCreation, checkValidationResult, userController.createUser);
router.get('/profile', auth, userController.getProfile);
router.get('/dashboard/stats', adminAuth, userController.getDashboardStats);

router.put('/:id', adminAuth, userController.updateUser);
router.delete('/:id', adminAuth, userController.deleteUser);
module.exports = router;