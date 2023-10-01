const User = require('../models/Users');
const Followers = require('../models/Followers');

const getSingleUser = async (req, res) => {
    const userID = req.params.userID;

    if (!userID) {
        return res.status(404).json({
            error: true,
            message: "invalid or blank user ID"
        })
    }

    const foundUser = await User.findOne({ userID: userID });

    if (!foundUser) {
        return res.status(404).json({
            error: true,
            message: "User not found"
        })
    }

    return res.status(200).json({
        success : true,
        message  : {foundUser}
    })
}

module.exports = {
    getSingleUser
}