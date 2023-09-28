const Users = require('../models/Users');
const User = require('../models/Users');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const getAccessToken = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies || !cookies.jwt) {
        return res.status(403).json(
            {   "error" : true,
                "message": "no refreshToken",
            }
        );
    }

    jwt.verify(cookies.jwt, process.env.REFRESH_TOKEN_SECRET, (error,decoded) => {
        if(error) {
            return 
            return res.sendStatus(403).json({ 
                error : true, 
                "message": "inavlid refresh token" 
            })
        }
        req.username = decoded.username,
        req.userID = decoded.userID
    } )
        


    const accessToken = jwt.sign(
        { "username": req.username, "userID": req.userID },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '30000s'
        }
    );


    return res.status(200).json(
        {   success: true,
            "accessToken": accessToken
        }
    )
}

module.exports = { getAccessToken };