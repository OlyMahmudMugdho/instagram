/* const usersDB = {
    users: require('../models/users.json'),
    setUsers: function (data) {
        this.users = data;
    }
}

const fs = require('fs'); */
const jwt = require('jsonwebtoken');
require('dotenv').config();

const getAccessToken = (req, res) => {
    const cookies = req.cookies;
    /* const refreshToken = cookies.jwt; */

    if (!cookies || !cookies.jwt) {
        return res.status(403).json(
            {
                "message": "unauthenticated"
            }
        );
    }

    /* let username;

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, decoded) => {
        if (error) {
            console.log(error.message);
            return res.sendStatus(403);
        }
        username = decoded.username;
    }
    ) */
    console.log(req.username)
    console.log(req.userID)
    const accessToken = jwt.sign(
        { "username": req.username, "userID" : req.userID  },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '30000s'
        }
    )
    console.log(accessToken);

    return res.status(200).json(
        {
            "accessToken": accessToken
        }
    )
}

module.exports = { getAccessToken };