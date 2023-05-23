const bcrypt = require('bcrypt');
/* const fs = require('fs'); */

/* const usersDB = {
    users: require('../models/users.json'),
    setUsers: function (data) {
        this.users = data;
    }
}; */

const uuid = require('uuid');
const Users = require('../models/Users');

const doRegister = async (req, res) => {
    const { username, password, name, email } = req.body;
    if (!username || !password || !name || !email) {
        return res.status(404).json({ "message": "empty field" });
    }

    const foundUser = await Users.findOne({ username }).exec();
    if (foundUser) return res.status(403).json({ "message": "in conflict" });
    console.log(password)

    try {
        const newUser = await Users.create({
            userID : uuid.v4(),
            username: username,
            password: await bcrypt.hash(password, 10),
            name: name,
            email: email
        });

        await newUser.save();
    }
    catch(error){
        return res.status(403).json(
            {
                "message" : error
            }
        )
    }

    /* usersDB.setUsers([...usersDB.users, newUser]);
    console.log(usersDB.users);

    await fs.writeFile('././models/users.json', JSON.stringify(usersDB.users), (err) => {
        if (err) console.log(err)
    }); */

    return res.status(200).json(
        {
            "message": "user added to database"
        }
    )
}

module.exports = { doRegister }