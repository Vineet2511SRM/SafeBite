const db = require('../config/db');

const Auth = {
    login: async (username) => {
        // Find active user by username
        const [rows] = await db.query(
            "SELECT * FROM System_User WHERE username = ? AND account_status = 'Active'",
            [username]
        );
        return rows[0];
    }
};

module.exports = Auth;
