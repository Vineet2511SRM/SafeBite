const db = require('../config/db');

const Category = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM Food_Category');
        return rows;
    },
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM Food_Category WHERE category_id = ?', [id]);
        return rows[0];
    },
    create: async (data) => {
        const { category_name, description, risk_level, is_active } = data;
        const [result] = await db.query(
            'INSERT INTO Food_Category (category_name, description, risk_level, is_active) VALUES (?, ?, ?, ?)',
            [category_name, description, risk_level, is_active]
        );
        return result;
    },
    update: async (id, data) => {
        const { category_name, description, risk_level, is_active } = data;
        const [result] = await db.query(
            'UPDATE Food_Category SET category_name = ?, description = ?, risk_level = ?, is_active = ? WHERE category_id = ?',
            [category_name, description, risk_level, is_active, id]
        );
        return result;
    },
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM Food_Category WHERE category_id = ?', [id]);
        return result;
    }
};

module.exports = Category;