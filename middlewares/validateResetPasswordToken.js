const Users = require('../models/Users');
const jwt = require('jsonwebtoken');

const validate = async (req,res,next) => {
    const code = req.body.code;
    const email = req.body.email;
    
    if(!code) {
        return res.status(404).json({
            error : true,
            message : "No code found"
        });
    }

    const matched = await Users.findOne({ $and : [ {email : email}, {resetCode : code} ] });

    if(!matched) {
        return res.status(403).json({
            error : true,
            message : "code not matched or expired"
        });
    }

    req.code = code;

    const accessToken = jwt.sign(
        {"code" : code},
        process.env.ACCESS_TOKEN_SECRET_FOR_PASSWORD_RESET,
        {
            expiresIn : '300s'
        }
    );

    res.cookie(
        'code',
        accessToken,
        {
            httpOnly : true
        }
    ).status(200).json({
        token : accessToken
    });

    return next();

}

module.exports = {
    validate
}