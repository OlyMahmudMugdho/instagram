const Users = require('../models/Users');
const jwt = require('jsonwebtoken');
const validate = async (req,res, next) => {
    const cookie = req.cookies;

    console.log(cookie.code);

    if(!cookie || !cookie.code) {
        return res.status(403).json({
            error : true,
            message : "access denied"
        });
    }

    jwt.verify(
        cookie.code,
        process.env.ACCESS_TOKEN_SECRET_FOR_PASSWORD_RESET,
        (error,decoded) => {
            if(error) {
                return res.status(500).json(
                    {
                        error : true,
                        message : "internal server error"
                    }
                );
            }

            console.log(decoded.code);
            next();
        }
    )
}

module.exports = {
    validate
}