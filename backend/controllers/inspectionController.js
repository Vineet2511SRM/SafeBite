const Inspection = require('../models/inspectionModel');

exports.getAllInspections = async (req, res) => {
    try {
        const inspections = await Inspection.getAll();
        res.json(inspections);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getInspectionById = async (req, res) => {
    try {
        const inspection = await Inspection.getById(req.params.id);
        if (!inspection) return res.status(404).json({ message: 'Inspection not found' });
        res.json(inspection);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getSchedules = async (req, res) => {
    try {
        const schedules = await Inspection.getSchedules();
        res.json(schedules);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createInspection = async (req, res) => {
    try {
        const result = await Inspection.create(req.body);
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateInspection = async (req, res) => {
    try {
        await Inspection.update(req.params.id, req.body);
        res.json({ id: req.params.id, ...req.body });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteInspection = async (req, res) => {
    try {
        await Inspection.delete(req.params.id);
        res.json({ message: 'Inspection deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
