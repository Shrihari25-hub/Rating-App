const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { validateStoreCreation, checkValidationResult } = require('../middleware/validation');
const { auth, adminAuth, storeOwnerAuth } = require('../middleware/auth');

router.get('/', auth, storeController.getAllStores);
router.get('/search', auth, storeController.searchStores);
router.post('/', adminAuth, validateStoreCreation, checkValidationResult, storeController.createStore);

router.get('/:id', auth, storeController.getStore);
router.get('/stats', auth, storeController.getStats); // Add this line
router.get('/owner/dashboard', storeOwnerAuth, storeController.getStoreOwnerDashboard);

module.exports = router;