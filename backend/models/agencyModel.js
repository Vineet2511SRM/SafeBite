const db = require('../config/db');

const Agency = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM Inspection_Agency');
        return rows;
    },
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM Inspection_Agency WHERE agency_id = ?', [id]);
        return rows[0];
    },
    create: async (data) => {
        const { agency_name, accreditation_number, region, email } = data;
        const [result] = await db.query(
            'INSERT INTO Inspection_Agency (agency_name, accreditation_number, region, email) VALUES (?, ?, ?, ?)',
            [agency_name, accreditation_number, region, email]
        );
        return result;
    },
    update: async (id, data) => {
        const { agency_name, accreditation_number, region, email } = data;
        const [result] = await db.query(
            'UPDATE Inspection_Agency SET agency_name = ?, accreditation_number = ?, region = ?, email = ? WHERE agency_id = ?',
            [agency_name, accreditation_number, region, email, id]
        );
        return result;
    },
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM Inspection_Agency WHERE agency_id = ?', [id]);
        return result;
    }
};

module.exports = Agency;