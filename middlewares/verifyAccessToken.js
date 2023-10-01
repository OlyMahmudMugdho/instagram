const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyAccess = async (req, res, next) => {
    const authHeader =await req.headers['authorization'];
    console.log(authHeader);
    if (!authHeader) {
        return res.status(403).json(
            {
                "message": "no accessToken"
            }
        )
    }

    const accessToken = await authHeader.split(' ')[1];
    console.log(accessToken)
    jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        (error, decoded) => {
            if (error) {
                console.log("error detected")
                console.log(error);
                return res.status(403).json(
                    {   error : true,
                        "message": "inavlid token from verifyAccessToken"
                    }
                )
            }
            req.author = decoded.username;
            console.log(decoded.username + " decoded")
            req.userID = decoded.userID;
            req.userIDForPost = decoded.userID;
            next();
        }
    );
}

module.exports = { verifyAccess };