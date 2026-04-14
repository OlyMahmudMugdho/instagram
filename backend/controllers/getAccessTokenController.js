const Users = require('../models/Users');
const User = require('../models/Users');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const getAccessToken = async (req, res) => {
    const refreshToken = req.cookies?.jwt || req.headers['authorization']?.split(' ')[1];
    
    if (!refreshToken) {
        return res.status(403).json({
            error: true,
            message: 'no refresh token'
        });
    }

    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        return res.status(403).json({
            error: true,
            message: 'invalid refresh token'
        });
    }

    req.username = decoded.username;
    req.userID = decoded.userID;

    const accessToken = jwt.sign(
        { "username": req.username, "userID": req.userID },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' }
    );

    const user = await Users.findOne({ userID: req.userID });

    return res.status(200).json({
        success: true,
        accessToken: accessToken,
        user: {
            _id: req.userID,
            username: req.username,
            email: user?.email || '',
            name: user?.name || '',
            avatar: user?.profilePicture || ''
        }
    });
}

module.exports = { getAccessToken };