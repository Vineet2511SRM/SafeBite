const CategoryStorageGuideline = require('../models/categoryStorageGuidelineModel');

exports.getGuidelinesByCategory = async (req, res) => {
    try {
        const guidelines = await CategoryStorageGuideline.getAllByCategory(req.params.categoryId);
        res.json(guidelines);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addGuideline = async (req, res) => {
    try {
        const { category_id, guideline } = req.body;
        await CategoryStorageGuideline.create(category_id, guideline);
        res.status(201).json({ message: 'Guideline added' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.removeGuideline = async (req, res) => {
    try {
        const { categoryId, guideline } = req.params;
        await CategoryStorageGuideline.delete(categoryId, guideline);
        res.json({ message: 'Guideline removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};