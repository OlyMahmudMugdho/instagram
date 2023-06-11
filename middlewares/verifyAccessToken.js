const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyAccess = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).json(
            {
                "message": "no accessToken"
            }
        )
    }

    const accessToken = authHeader.split(' ')[1];
    jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        (error, decoded) => {
            if (error) {
                console.log(error);
                return res.status(403).json(
                    {
                        "message": "inavlid token from verifyAccessToken"
                    }
                )
            }
            req.author = decoded.username;
            req.userID = decoded.userID;
            req.userIDForPost = decoded.userID;
            next();
        }
    );
}

module.exports = { verifyAccess };