const Compliance = require('../models/complianceModel');

exports.getAllCompliance = async (req, res) => {
    try {
        const compliance = await Compliance.getAll();
        res.json(compliance);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getComplianceById = async (req, res) => {
    try {
        const record = await Compliance.getById(req.params.id);
        if (!record) return res.status(404).json({ message: 'Compliance record not found' });
        res.json(record);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getStandards = async (req, res) => {
    try {
        const standards = await Compliance.getStandards();
        res.json(standards);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getBatches = async (req, res) => {
    try {
        const batches = await Compliance.getBatches();
        res.json(batches);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createCompliance = async (req, res) => {
    try {
        const result = await Compliance.create(req.body);
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateCompliance = async (req, res) => {
    try {
        await Compliance.update(req.params.id, req.body);
        res.json({ id: req.params.id, ...req.body });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteCompliance = async (req, res) => {
    try {
        await Compliance.delete(req.params.id);
        res.json({ message: 'Compliance record deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
