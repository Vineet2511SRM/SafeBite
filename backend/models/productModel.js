const db = require('../config/db');

const Product = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT p.*, m.first_name, m.last_name, c.category_name 
            FROM Food_Product p
            JOIN Food_Manufacturer m ON p.manufacturer_id = m.manufacturer_id
            JOIN Food_Category c ON p.category_id = c.category_id
        `);
        return rows;
    },
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM Food_Product WHERE product_id = ?', [id]);
        return rows[0];
    },
    create: async (data) => {
        const { product_id, product_name, shelf_life, approval_status, manufacturer_id, category_id } = data;
        const [result] = await db.query(
            'INSERT INTO Food_Product (product_id, product_name, shelf_life, approval_status, manufacturer_id, category_id) VALUES (?, ?, ?, ?, ?, ?)',
            [product_id, product_name, shelf_life, approval_status, manufacturer_id, category_id]
        );
        return result;
    },
    update: async (id, data) => {
        const { product_name, shelf_life, approval_status, manufacturer_id, category_id } = data;
        const [result] = await db.query(
            'UPDATE Food_Product SET product_name = ?, shelf_life = ?, approval_status = ?, manufacturer_id = ?, category_id = ? WHERE product_id = ?',
            [product_name, shelf_life, approval_status, manufacturer_id, category_id, id]
        );
        return result;
    },
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM Food_Product WHERE product_id = ?', [id]);
        return result;
    }
};

module.exports = Product;
