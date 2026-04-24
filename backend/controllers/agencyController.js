const Agency = require('../models/agencyModel');

exports.getAllAgencies = async (req, res) => {
    try {
        const agencies = await Agency.getAll();
        res.json(agencies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAgencyById = async (req, res) => {
    try {
        const agency = await Agency.getById(req.params.id);
        if (!agency) return res.status(404).json({ message: 'Agency not found' });
        res.json(agency);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createAgency = async (req, res) => {
    try {
        const result = await Agency.create(req.body);
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateAgency = async (req, res) => {
    try {
        await Agency.update(req.params.id, req.body);
        res.json({ id: req.params.id, ...req.body });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteAgency = async (req, res) => {
    try {
        await Agency.delete(req.params.id);
        res.json({ message: 'Agency deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};