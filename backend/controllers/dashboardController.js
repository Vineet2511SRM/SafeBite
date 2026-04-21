const Dashboard = require('../models/dashboardModel');

exports.getStats = async (req, res) => {
    try {
        const stats = await Dashboard.getStats();
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
