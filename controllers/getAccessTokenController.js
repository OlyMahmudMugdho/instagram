const Users = require('../models/Users');
const User = require('../models/Users');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const getAccessToken = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies || !cookies.jwt) {
        return res.status(403).json(
            {   "error" : "no refreshToken",
                "message": "unauthenticated",
            }
        );
    }

    jwt.verify(cookies.jwt, process.env.REFRESH_TOKEN_SECRET, (error,decoded) => {
        if(error) {
            return res.status(403).json({ "message": error.message })
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
        {
            "accessToken": accessToken
        }
    )
}

module.exports = { getAccessToken };