const db = require('../config/db');

const Compliance = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT c.*, p.product_name, s.standard_name
            FROM Compliance_Record c
            JOIN Food_Product p ON c.product_id = p.product_id
            JOIN Compliance_Standard s ON c.standard_id = s.standard_id
        `);
        return rows;
    },
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM Compliance_Record WHERE compliance_id = ?', [id]);
        return rows[0];
    },
    getStandards: async () => {
        const [rows] = await db.query('SELECT * FROM Compliance_Standard');
        return rows;
    },
    getBatches: async () => {
        const [rows] = await db.query(`
            SELECT b.*, p.product_name 
            FROM Food_Batch b
            JOIN Food_Product p ON b.product_id = p.product_id
        `);
        return rows;
    },
    create: async (data) => {
        const { compliance_id, product_id, batch_id, standard_id, compliance_status, checked_date, violation_count } = data;
        const [result] = await db.query(
            'INSERT INTO Compliance_Record (compliance_id, product_id, batch_id, standard_id, compliance_status, checked_date, violation_count) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [compliance_id, product_id, batch_id, standard_id, compliance_status, checked_date, violation_count]
        );
        return result;
    },
    update: async (id, data) => {
        const { compliance_status, violation_count, checked_date } = data;
        const [result] = await db.query(
            'UPDATE Compliance_Record SET compliance_status = ?, violation_count = ?, checked_date = ? WHERE compliance_id = ?',
            [compliance_status, violation_count, checked_date, id]
        );
        return result;
    },
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM Compliance_Record WHERE compliance_id = ?', [id]);
        return result;
    }
};

module.exports = Compliance;
