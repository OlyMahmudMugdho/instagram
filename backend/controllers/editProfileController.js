const User = require('../models/Users');

const editProfile = async (req, res) => {
    const { name, email } = req.body;
    const userID = req.userID;

    if (!name && !email) {
        return res.status(404).json({
            error: true,
            message: "please enter name or email"
        })
    }

    foundUser = await User.findOne({ userID: userID });

    if (await !foundUser) {
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        })
    }

    if (name && !email) {
        foundUser.name = await name;
        await foundUser.save();
    }
    if (!name && email) {
        foundUser.email = await email;
        await foundUser.save();
    }

    if(name && email) {
        foundUser.name = await name;
        foundUser.email = await email;
        await foundUser.save();
    }

    let message;
    (name && email) ? message = "name and email changed" : (name && !email) ? message = "name changed" : message = "email changed";

    return res.status(200).json({
        success: true,
        message: message
    })
}

module.exports = {
    editProfile
}