const User = require('../models/Users');
const Followers = require('../models/Followers');
const Friend = require('../models/Friend');

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

    // Check if the current logged in user is following this user
    let isFollowing = false;
    let isFriend = false;
    if (req.userID) {
        const relationship = await Followers.findOne({ follower: req.userID, following: userID });
        isFollowing = !!relationship;

        const friendship = await Friend.findOne({
            $or: [
                { sender: req.userID, receiver: userID },
                { sender: userID, receiver: req.userID }
            ],
            status: 'accepted'
        });
        isFriend = !!friendship;
    }

    foundUser.followers = followersCount;
    foundUser.following = followingCount;
    foundUser.isFollowing = isFollowing;
    foundUser.isFriend = isFriend;

    return res.status(200).json({
        success : true,
        message  : {foundUser}
    })
}

module.exports = {
    getSingleUser
}