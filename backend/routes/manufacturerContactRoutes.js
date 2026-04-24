const express = require('express');
const router = express.Router();
const manufacturerContactController = require('../controllers/manufacturerContactController');

router.get('/:manufacturerId/contacts', manufacturerContactController.getContactsByManufacturer);
router.post('/contacts', manufacturerContactController.addContact);
router.delete('/:manufacturerId/contacts/:contactNumber', manufacturerContactController.removeContact);

module.exports = router;