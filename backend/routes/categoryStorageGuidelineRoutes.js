const express = require('express');
const router = express.Router();
const categoryStorageGuidelineController = require('../controllers/categoryStorageGuidelineController');

router.get('/:categoryId/guidelines', categoryStorageGuidelineController.getGuidelinesByCategory);
router.post('/guidelines', categoryStorageGuidelineController.addGuideline);
router.delete('/:categoryId/guidelines/:guideline', categoryStorageGuidelineController.removeGuideline);

module.exports = router;