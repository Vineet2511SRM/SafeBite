const Auth = require('../models/authModel');

exports.login = async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ message: 'Username is required' });
        }

        const user = await Auth.login(username);
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or inactive account' });
        }

        // In a real app, generate a JWT here. For demo, we just return the user.
        res.json({
            message: 'Login successful',
            user: {
                id: user.user_id,
                username: user.username,
                role: user.role,
                inspector_id: user.inspector_id
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
