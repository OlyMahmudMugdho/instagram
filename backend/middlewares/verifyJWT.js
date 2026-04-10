const jwt = require('jsonwebtoken');
require('dotenv').config();
const verify = async (req, res, next) => {
    console.log(await req.headers);
    const authHeader = await req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).json(
            {
                "message": "no refresh token"
            }
        )
    }
    const refreshToken = authHeader.split(' ')[1];
    await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, decoded) => {
        if (error) {
            return res.status(403).json({ "message": error.message })
        }
        else {
            req.username = decoded.username;
            req.userID = decoded.userID;
            next();
        }
    })
}

module.exports = { verify };