const Complaint = require('../models/complaintModel');

exports.getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.getAll();
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.getById(req.params.id);
        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
        res.json(complaint);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getConsumers = async (req, res) => {
    try {
        const consumers = await Complaint.getConsumers();
        res.json(consumers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createComplaint = async (req, res) => {
    try {
        await Complaint.create(req.body);
        res.status(201).json({ id: req.body.complaint_id, ...req.body });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateComplaint = async (req, res) => {
    try {
        await Complaint.update(req.params.id, req.body);
        res.json({ id: req.params.id, ...req.body });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteComplaint = async (req, res) => {
    try {
        await Complaint.delete(req.params.id);
        res.json({ message: 'Complaint deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
