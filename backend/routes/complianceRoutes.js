const express = require('express');
const router = express.Router();
const complianceController = require('../controllers/complianceController');

router.get('/', complianceController.getAllCompliance);
router.get('/standards', complianceController.getStandards);
router.get('/batches', complianceController.getBatches);
router.get('/:id', complianceController.getComplianceById);
router.post('/', complianceController.createCompliance);
router.put('/:id', complianceController.updateCompliance);
router.delete('/:id', complianceController.deleteCompliance);

module.exports = router;
