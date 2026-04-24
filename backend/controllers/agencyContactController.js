const AgencyContact = require('../models/agencyContactModel');

exports.getContactsByAgency = async (req, res) => {
    try {
        const contacts = await AgencyContact.getAllByAgency(req.params.agencyId);
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addContact = async (req, res) => {
    try {
        const { agency_id, contact_number } = req.body;
        await AgencyContact.create(agency_id, contact_number);
        res.status(201).json({ message: 'Contact added' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.removeContact = async (req, res) => {
    try {
        const { agencyId, contactNumber } = req.params;
        await AgencyContact.delete(agencyId, contactNumber);
        res.json({ message: 'Contact removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};