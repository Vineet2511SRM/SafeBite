const express = require('express');
const router = express.Router();
const inspectionController = require('../controllers/inspectionController');

router.get('/', inspectionController.getAllInspections);
router.get('/schedules', inspectionController.getSchedules);
router.get('/:id', inspectionController.getInspectionById);
router.post('/', inspectionController.createInspection);
router.put('/:id', inspectionController.updateInspection);
router.delete('/:id', inspectionController.deleteInspection);

module.exports = router;
