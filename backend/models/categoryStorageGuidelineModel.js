const db = require('../config/db');

const CategoryStorageGuideline = {
    getAllByCategory: async (categoryId) => {
        const [rows] = await db.query('SELECT * FROM Category_Storage_Guidelines WHERE category_id = ?', [categoryId]);
        return rows;
    },
    create: async (categoryId, guideline) => {
        const [result] = await db.query(
            'INSERT INTO Category_Storage_Guidelines (category_id, guideline) VALUES (?, ?)',
            [categoryId, guideline]
        );
        return result;
    },
    delete: async (categoryId, guideline) => {
        const [result] = await db.query(
            'DELETE FROM Category_Storage_Guidelines WHERE category_id = ? AND guideline = ?',
            [categoryId, guideline]
        );
        return result;
    }
};

module.exports = CategoryStorageGuideline;