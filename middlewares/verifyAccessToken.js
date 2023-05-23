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
                return res.status(403).json(
                    {
                        "message": "inavlid token from verifyAccessToken"
                    }
                )
                console.log(error);
            }
            console.log()
            req.author = decoded.userID;
            next();
        }
    );
}

module.exports = { verifyAccess };