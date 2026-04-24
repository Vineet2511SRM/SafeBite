const express = require('express');
const router = express.Router();
const productCertificationController = require('../controllers/productCertificationController');

router.get('/:productId/certifications', productCertificationController.getCertificationsByProduct);
router.post('/certifications', productCertificationController.addCertification);
router.delete('/:productId/certifications/:certification', productCertificationController.removeCertification);

module.exports = router;