const bcrypt = require('bcrypt');
const uuid = require('uuid');
const Users = require('../models/Users');

const doRegister = async (req, res) => {
    const { username, password, name, email } = await req.body;
    console.log(username)

    if (!username || !password || !name || !email) {
        return res.status(404).json({ "message": "empty field" });
    }

    const foundUser = await Users.findOne({ username }).exec();
    if (foundUser) return res.status(403).json({ "message": "in conflict" });

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
                "error" : true,
                "message" : error
            }
        )
    }

    return res.status(200).json(
        {
            "message": "user added to database"
        }
    );
}

module.exports = { doRegister };
