const Manufacturer = require('../models/manufacturerModel');

exports.getAllManufacturers = async (req, res) => {
    try {
        const manufacturers = await Manufacturer.getAll();
        res.json(manufacturers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getManufacturerById = async (req, res) => {
    try {
        const manufacturer = await Manufacturer.getById(req.params.id);
        if (!manufacturer) return res.status(404).json({ message: 'Manufacturer not found' });
        res.json(manufacturer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createManufacturer = async (req, res) => {
    try {
        const result = await Manufacturer.create(req.body);
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateManufacturer = async (req, res) => {
    try {
        await Manufacturer.update(req.params.id, req.body);
        res.json({ id: req.params.id, ...req.body });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteManufacturer = async (req, res) => {
    try {
        await Manufacturer.delete(req.params.id);
        res.json({ message: 'Manufacturer deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
