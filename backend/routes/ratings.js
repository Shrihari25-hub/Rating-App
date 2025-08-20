const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { validateRating, checkValidationResult } = require('../middleware/validation');
const { auth } = require('../middleware/auth');

router.post('/', auth, validateRating, checkValidationResult, ratingController.submitRating);

router.get('/user/:storeId', auth, ratingController.getUserRating);

router.get('/store/:storeId', auth, ratingController.getStoreRatings);

router.get('/stats', auth, ratingController.getStats);

module.exports = router;