const db = require('../config/db');

const Inspection = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT i.*, s.scheduled_date, s.inspection_type, p.product_name
            FROM Inspection i
            JOIN Inspection_Schedule s ON i.schedule_id = s.schedule_id
            JOIN Food_Product p ON s.product_id = p.product_id
        `);
        return rows;
    },
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM Inspection WHERE inspection_id = ?', [id]);
        return rows[0];
    },
    getSchedules: async () => {
        const [rows] = await db.query(`
            SELECT s.*, p.product_name 
            FROM Inspection_Schedule s
            JOIN Food_Product p ON s.product_id = p.product_id
            WHERE s.schedule_id NOT IN (SELECT schedule_id FROM Inspection)
        `);
        return rows;
    },
    create: async (data) => {
        const { schedule_id, inspection_date, inspection_result, risk_score, remarks } = data;
        const [result] = await db.query(
            'INSERT INTO Inspection (schedule_id, inspection_date, inspection_result, risk_score, remarks) VALUES (?, ?, ?, ?, ?)',
            [schedule_id, inspection_date, inspection_result, risk_score, remarks]
        );
        return result;
    },
    update: async (id, data) => {
        const { inspection_date, inspection_result, risk_score, remarks } = data;
        const [result] = await db.query(
            'UPDATE Inspection SET inspection_date = ?, inspection_result = ?, risk_score = ?, remarks = ? WHERE inspection_id = ?',
            [inspection_date, inspection_result, risk_score, remarks, id]
        );
        return result;
    },
    delete: async (id) => {
        // Leverages ON DELETE CASCADE for Lab_Test and Sample_Collection
        const [result] = await db.query('DELETE FROM Inspection WHERE inspection_id = ?', [id]);
        return result;
    }
};

module.exports = Inspection;
