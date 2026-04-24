const db = require('../config/db');

const ProductCertification = {
    getAllByProduct: async (productId) => {
        const [rows] = await db.query('SELECT * FROM Product_Certifications WHERE product_id = ?', [productId]);
        return rows;
    },
    create: async (productId, certification) => {
        const [result] = await db.query(
            'INSERT INTO Product_Certifications (product_id, certification) VALUES (?, ?)',
            [productId, certification]
        );
        return result;
    },
    delete: async (productId, certification) => {
        const [result] = await db.query(
            'DELETE FROM Product_Certifications WHERE product_id = ? AND certification = ?',
            [productId, certification]
        );
        return result;
    }
};

module.exports = ProductCertification;