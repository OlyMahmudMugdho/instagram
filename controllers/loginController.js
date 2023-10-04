const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/Users');
require('dotenv').config();


const handleLogin = async (req, res) => {

    const { username, password } = await req.body;

    if (!username || !password) {
        return res.status(403).json({ "message": "empty fields" });
    }

    console.log(username, " ", password)

    const foundUser = await Users.findOne({ username: username }).exec();


    if (!foundUser) {
        return res.status(403).json(
            {
                "message": "user not found"
            }
        )
    }

    const matched = await bcrypt.compare(password, foundUser.password);

    if (!matched) {

        return res.status(403).json(
            {
                "message": "wrong password"
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

    foundUser.refreshToken = refreshToken;
    console.log(process.env.REFRESH_TOKEN_SECRET, " checking process.env")
    await foundUser.save();


    const oneDay = 1000 * 60 * 60 * 24;

  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: true,
    domain: ".onrender.com"
  });


    return res.json(
        {
            "refreshToken": refreshToken,
            "message": "logged in",
            data: [
                { userID: await foundUser.userID }
            ]
        }
    )
}

module.exports = { handleLogin }
