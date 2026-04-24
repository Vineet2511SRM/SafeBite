const db = require('../config/db');

const Manufacturer = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM Food_Manufacturer');
        return rows;
    },
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM Food_Manufacturer WHERE manufacturer_id = ?', [id]);
        return rows[0];
    },
    create: async (data) => {
        const { first_name, last_name, license_number, street, city, state, pincode, registration_date } = data;
        const [result] = await db.query(
            'INSERT INTO Food_Manufacturer (first_name, last_name, license_number, street, city, state, pincode, registration_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [first_name, last_name, license_number, street, city, state, pincode, registration_date]
        );
        return result;
    },
    update: async (id, data) => {
        const { first_name, last_name, license_number, street, city, state, pincode, registration_date } = data;
        const [result] = await db.query(
            'UPDATE Food_Manufacturer SET first_name = ?, last_name = ?, license_number = ?, street = ?, city = ?, state = ?, pincode = ?, registration_date = ? WHERE manufacturer_id = ?',
            [first_name, last_name, license_number, street, city, state, pincode, registration_date, id]
        );
        return result;
    },
    delete: async (id) => {
        // Leverages ON DELETE CASCADE for Products, Contacts, Batches, Inspections, etc.
        const [result] = await db.query('DELETE FROM Food_Manufacturer WHERE manufacturer_id = ?', [id]);
        return result;
    }
};

module.exports = Manufacturer;
