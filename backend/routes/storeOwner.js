const express = require('express');
const router = express.Router();
const storeOwnerController = require('../controllers/storeOwnerController');
const { storeOwnerAuth } = require('../middleware/auth');

router.get('/dashboard', storeOwnerAuth, storeOwnerController.getDashboard);

module.exports = router;