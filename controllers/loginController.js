const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/Users');
require('dotenv').config();

/* const fs = require('fs'); */
/* const usersDB = {
    users: require('../models/users.json'),
    setUsers: function (data) {
        this.data = data;
    }
} */

const handleLogin = async (req, res) => {

    const { username, password } = await req.body;

    if (!username || !password) {
        return res.status(403).json({ "message": "empty fields" });
    }

    const foundUser = await Users.findOne({ username: username }).exec();
    console.log(foundUser);

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

    console.log(foundUser.userID, " from loginController")
    const refreshToken = jwt.sign(
        { "username": foundUser.username, "userID" : foundUser.userID},
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: '3d'
        }
    );

    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    /* const otherUsers = usersDB.users.filter(person => person.username !== username);

    usersDB.setUsers([])
    fs.writeFileSync('././models/users.json', JSON.stringify(usersDB.users)); */

    return res.status(200).cookie(
        'jwt',
        refreshToken,
        { httpOnly: true, expiresIn: '60*60*1000s' }
    ).json(
        {
            "refreshToken": refreshToken,
            "message": "logged in"
        }
    )
}

module.exports = { handleLogin }
