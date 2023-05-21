const jwt = require('jsonwebtoken');
require('dotenv').config();
const verify = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    if (!authHeader) {
        return res.status(403).json(
            {
                "message": "no access token"
            }
        )
    }
    const refreshToken = authHeader.split(' ')[1];
    jwt.verify(refreshToken, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
        console.log(decoded);
        if (error) {
            return res.status(403).json({ "message": error.message })
        }
        else {
            req.username = decoded.username;
            next();
        }
    })
}

module.exports = { verify };