const usersDB = {
    users: require('../models/users.json'),
    setUsers: function (data) {
        this.users = data;
    }
};
const fs = require('fs');

const logOut = (req, res) => {
    const cookies = req.cookies;
    if (!cookies || !cookies.jwt) {
        return res.sendStatus(204);
    }

    const refreshToken = cookies.jwt;
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);

    if (!foundUser) {
        return res.status(204).clearCookie(
            'jwt',
            {
                httpOnly: true,
                expiresIn: '60*60*1000s'
            }
        ).json(
            {
                "message" : "user not found, cookie cleared"
            }
        );
    }

    const otherUsers = usersDB.users.filter(person => person.refreshToken !== refreshToken);
    foundUser.refreshToken = ' ';
    usersDB.setUsers([...otherUsers, foundUser]);

    console.log(usersDB.users);


    fs.writeFileSync('././models/users.json', JSON.stringify(usersDB.users));
    
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