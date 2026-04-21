const db = require('../config/db');

const Dashboard = {
    getStats: async () => {
        const stats = {};
        
        const [manufacturers] = await db.query('SELECT COUNT(*) as count FROM Food_Manufacturer');
        stats.totalManufacturers = manufacturers[0].count;

        const [products] = await db.query('SELECT COUNT(*) as count FROM Food_Product');
        stats.totalProducts = products[0].count;

        const [inspections] = await db.query('SELECT COUNT(*) as count FROM Inspection');
        stats.totalInspections = inspections[0].count;

        const [complaints] = await db.query('SELECT COUNT(*) as count FROM Complaint');
        stats.totalComplaints = complaints[0].count;

        const [recalls] = await db.query("SELECT COUNT(*) as count FROM Recall_Notice WHERE recall_status = 'Active'");
        stats.totalRecalls = recalls[0].count;

        const [violations] = await db.query('SELECT SUM(violation_count) as total FROM Compliance_Record WHERE violation_count > 0');
        stats.totalViolations = violations[0].total || 0;

        return stats;
    }
};

module.exports = Dashboard;
