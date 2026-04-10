const router = require('express').Router();
const Users = require('../models/Users');

router.route('/users/me')
    .get(async (req, res) => {
        try {
            const authHeader = req.headers['authorization'];
            if (!authHeader) {
                return res.status(403).json({ success: false, message: 'No token' });
            }
            
            const jwt = require('jsonwebtoken');
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            
            const user = await Users.findOne({ userID: decoded.userID });
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            
            res.json({
                success: true,
                user: {
                    _id: user.userID,
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    avatar: user.profilePicture || '',
                    followers: user.followers || 0,
                    following: user.following || 0
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    });

module.exports = router;