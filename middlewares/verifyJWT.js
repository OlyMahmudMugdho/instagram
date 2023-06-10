const jwt = require('jsonwebtoken');
require('dotenv').config();
const verify = async (req, res, next) => {
    const authHeader = await req.headers['authorization'];
    console.log(authHeader);
    if (!authHeader) {
        return res.status(403).json(
            {
                "message": "no refresh token"
            }
        )
    }
    const refreshToken = authHeader.split(' ')[1];
    await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, decoded) => {
        console.log(decoded);
        if (error) {
            return res.status(403).json({ "message": error.message })
        }
        else {
            req.username = decoded.username;
            req.userID = decoded.userID;
            console.log(decoded.userID, "from verifyJWT");
            console.log(decoded.username, "from verifyJWT");
            next();
        }
    })
}

module.exports = { verify };