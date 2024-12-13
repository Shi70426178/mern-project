const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.user.id);

        if (!user || !user.isAdmin) {
            return res.status(403).json({ msg: 'Access denied' });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error('Error verifying admin:', err.message);
        res.status(401).json({ msg: 'Invalid token' });
    }
};
