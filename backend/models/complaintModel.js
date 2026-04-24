const db = require('../config/db');

const Complaint = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT c.*, co.first_name, co.last_name, p.product_name
            FROM Complaint c
            JOIN Consumer co ON c.consumer_id = co.consumer_id
            JOIN Food_Product p ON c.product_id = p.product_id
        `);
        return rows;
    },
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM Complaint WHERE complaint_id = ?', [id]);
        return rows[0];
    },
    getConsumers: async () => {
        const [rows] = await db.query('SELECT consumer_id, CONCAT(first_name, " ", last_name) AS name FROM Consumer');
        return rows;
    },
    create: async (data) => {
        const { consumer_id, product_id, complaint_date, complaint_type, status } = data;
        const [result] = await db.query(
            'INSERT INTO Complaint (consumer_id, product_id, complaint_date, complaint_type, status) VALUES (?, ?, ?, ?, ?)',
            [consumer_id, product_id, complaint_date, complaint_type, status]
        );
        return result;
    },
    update: async (id, data) => {
        const { status, complaint_type } = data;
        const [result] = await db.query(
            'UPDATE Complaint SET status = ?, complaint_type = ? WHERE complaint_id = ?',
            [status, complaint_type, id]
        );
        return result;
    },
    delete: async (id) => {
        // Leverages ON DELETE CASCADE for Enforcement_Action records natively in the DB
        const [result] = await db.query('DELETE FROM Complaint WHERE complaint_id = ?', [id]);
        return result;
    }
};

module.exports = Complaint;
