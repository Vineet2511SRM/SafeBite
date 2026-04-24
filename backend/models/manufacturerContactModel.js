const db = require('../config/db');

const ManufacturerContact = {
    getAllByManufacturer: async (manufacturerId) => {
        const [rows] = await db.query('SELECT * FROM Manufacturer_Contact WHERE manufacturer_id = ?', [manufacturerId]);
        return rows;
    },
    create: async (manufacturerId, contactNumber) => {
        const [result] = await db.query(
            'INSERT INTO Manufacturer_Contact (manufacturer_id, contact_number) VALUES (?, ?)',
            [manufacturerId, contactNumber]
        );
        return result;
    },
    delete: async (manufacturerId, contactNumber) => {
        const [result] = await db.query(
            'DELETE FROM Manufacturer_Contact WHERE manufacturer_id = ? AND contact_number = ?',
            [manufacturerId, contactNumber]
        );
        return result;
    }
};

module.exports = ManufacturerContact;