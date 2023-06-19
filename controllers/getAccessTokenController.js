
const jwt = require('jsonwebtoken');
require('dotenv').config();

const getAccessToken = (req, res) => {
    const cookies = req.cookies;

    if (!cookies || !cookies.jwt) {
        return res.status(403).json(
            {
                "message": "unauthenticated"
            }
        );
    }

    const accessToken = jwt.sign(
        { "username": req.username, "userID" : req.userID  },
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