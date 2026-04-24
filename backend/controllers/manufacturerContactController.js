const ManufacturerContact = require('../models/manufacturerContactModel');

exports.getContactsByManufacturer = async (req, res) => {
    try {
        const contacts = await ManufacturerContact.getAllByManufacturer(req.params.manufacturerId);
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addContact = async (req, res) => {
    try {
        const { manufacturer_id, contact_number } = req.body;
        await ManufacturerContact.create(manufacturer_id, contact_number);
        res.status(201).json({ message: 'Contact added' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.removeContact = async (req, res) => {
    try {
        const { manufacturerId, contactNumber } = req.params;
        await ManufacturerContact.delete(manufacturerId, contactNumber);
        res.json({ message: 'Contact removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};