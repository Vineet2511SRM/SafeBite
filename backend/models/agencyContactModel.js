const db = require('../config/db');

const AgencyContact = {
    getAllByAgency: async (agencyId) => {
        const [rows] = await db.query('SELECT * FROM Agency_Contact WHERE agency_id = ?', [agencyId]);
        return rows;
    },
    create: async (agencyId, contactNumber) => {
        const [result] = await db.query(
            'INSERT INTO Agency_Contact (agency_id, contact_number) VALUES (?, ?)',
            [agencyId, contactNumber]
        );
        return result;
    },
    delete: async (agencyId, contactNumber) => {
        const [result] = await db.query(
            'DELETE FROM Agency_Contact WHERE agency_id = ? AND contact_number = ?',
            [agencyId, contactNumber]
        );
        return result;
    }
};

module.exports = AgencyContact;