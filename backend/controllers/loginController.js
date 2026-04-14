const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/Users');
require('dotenv').config();


const handleLogin = async (req, res) => {

    const { username, password } = await req.body;

    if (!username || !password) {
        return res.status(403).json({ 
            error : true,
            "message": "empty fields"
     });
    }

    const foundUser = await Users.findOne({ username: username }).exec();


    if (!foundUser) {
        return res.status(403).json(
            {
                error: true,
                message: "user not found"
            }
        )
    }

    const matched = await bcrypt.compare(password, foundUser.password);

    if (!matched) {

        return res.status(403).json(
            {
                error: true,
                message: "wrong password"
            }
        )
    }


    const refreshToken = jwt.sign(
        { "username": foundUser.username, "userID": foundUser.userID },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: '3d'
        }
    );
    const accessToken = jwt.sign(
        { "username": foundUser.username, "userID": foundUser.userID },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '1d'
        }
    );

    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    const isProduction = process.env.NODE_ENV === 'production';

    return res.status(200).cookie(
        'jwt',
        refreshToken,
        {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 3 * 24 * 60 * 60 * 1000
        }
    ).json(
        {
            success: true,
            accessToken: accessToken,
            refreshToken: refreshToken,
            message: "logged in",
            user: {
                _id: foundUser.userID,
                username: foundUser.username,
                name: foundUser.name,
                email: foundUser.email,
                avatar: foundUser.profilePicture || ''
            }
        }
    )
}

module.exports = { handleLogin }
