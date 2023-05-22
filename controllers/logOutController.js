/* const usersDB = {
    users: require('../models/users.json'),
    setUsers: function (data) {
        this.users = data;
    }
};
const fs = require('fs'); */

const Users = require('../models/Users');

const logOut = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies || !cookies.jwt) {
        return res.sendStatus(204);
    }

    const refreshToken = cookies.jwt;
    const foundUser = await Users.findOne({refreshToken : refreshToken}).exec();

    if (!foundUser) {
        return res.status(204).clearCookie(
            'jwt'
        ).json(
            {
                "message" : "user not found, cookie cleared"
            }
        );
    }

    /* const otherUsers = usersDB.users.filter(person => person.refreshToken !== refreshToken);
    usersDB.setUsers([...otherUsers, foundUser]); */

    
    /* console.log(usersDB.users);
    
    
    fs.writeFileSync('././models/users.json', JSON.stringify(usersDB.users)); */
    
    foundUser.refreshToken = '';
    await foundUser.save();
    
    return res.status(204).clearCookie(
        'jwt',
        {
            httpOnly : true,
            expiresIn : '60*60*1000s'
        }
    ).json(
        {
            "message" : "logged out succesfully"
        }
    )

}

module.exports = { logOut };