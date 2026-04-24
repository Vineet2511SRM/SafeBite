const express = require('express');
const router = express.Router();
const agencyContactController = require('../controllers/agencyContactController');

router.get('/:agencyId/contacts', agencyContactController.getContactsByAgency);
router.post('/contacts', agencyContactController.addContact);
router.delete('/:agencyId/contacts/:contactNumber', agencyContactController.removeContact);

module.exports = router;