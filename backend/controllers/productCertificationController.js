const ProductCertification = require('../models/productCertificationModel');

exports.getCertificationsByProduct = async (req, res) => {
    try {
        const certifications = await ProductCertification.getAllByProduct(req.params.productId);
        res.json(certifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addCertification = async (req, res) => {
    try {
        const { product_id, certification } = req.body;
        await ProductCertification.create(product_id, certification);
        res.status(201).json({ message: 'Certification added' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.removeCertification = async (req, res) => {
    try {
        const { productId, certification } = req.params;
        await ProductCertification.delete(productId, certification);
        res.json({ message: 'Certification removed' });
    } catch (err) {
        res.status(500).json({ message: 'Certification not found' });
    }
};