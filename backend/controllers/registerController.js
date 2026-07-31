const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const Users = require('../models/Users');

const doRegister = async (req, res) => {
    const { username, password, name, email } = await req.body;

    if (!username || !password || !name || !email) {
        return res.status(404).json({ success: false, "message": "empty field" });
    }

    const foundUser = await Users.findOne({ username }).exec();
    if (foundUser) return res.status(403).json({ success: false, "message": "in conflict" });

    let newUser;

    try {
        newUser = await Users.create({
            userID : uuid.v4(),
            username: username,
            password: await bcrypt.hash(password, 10),
            name: name,
            email: email
        });
    }
    catch(error){
        return res.status(403).json(
            {
                success: false,
                "error" : true,
                "message" : error
            }
        )
    }

    const refreshToken = jwt.sign(
        { "username": newUser.username, "userID": newUser.userID },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: '3d'
        }
    );
    const accessToken = jwt.sign(
        { "username": newUser.username, "userID": newUser.userID },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '1d'
        }
    );

    newUser.refreshToken = refreshToken;
    await newUser.save();

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
            message: "user added to database",
            user: {
                _id: newUser.userID,
                username: newUser.username,
                name: newUser.name,
                email: newUser.email,
                avatar: newUser.profilePicture || ''
            }
        }
    );
}

module.exports = { doRegister };
