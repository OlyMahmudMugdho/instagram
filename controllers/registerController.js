const bcrypt = require('bcrypt');
const fs = require('fs');

const usersDB = {
    users: require('../models/users.json'),
    setUsers: function (data) {
        this.users = data;
    }
};

const doRegister = async (req, res) => {
    const { username, password } = await req.body;
    if (!username || !password) return res.status(404).json({ "message": "empty field" });

    const foundUser = await usersDB.users.find(person => person.username === username);
    if (foundUser) return res.status(403).json({ "message": "in conflict" });
    console.log(password)

    const newUser = {
        "username": username,
        "password": await bcrypt.hash(password, 10)
    }

    usersDB.setUsers([...usersDB.users, newUser]);
    console.log(usersDB.users);

    await fs.writeFile('././models/users.json', JSON.stringify(usersDB.users), (err) => {
        if (err) console.log(err)
    });

    return res.status(200).json(
        {
            "message": "user added to database"
        }
    )
}

module.exports = { doRegister }