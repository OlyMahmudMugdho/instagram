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

    const foundUser = await User.findOne({ userID: userID }).lean();

    if (!foundUser) {
        return res.status(404).json({
            error: true,
            message: "User not found"
        })
    }

    const followersCount = await Followers.countDocuments({ following: userID });
    const followingCount = await Followers.countDocuments({ follower: userID });

    foundUser.followers = followersCount;
    foundUser.following = followingCount;

    return res.status(200).json({
        success : true,
        message  : {foundUser}
    })
}

module.exports = {
    getSingleUser
}