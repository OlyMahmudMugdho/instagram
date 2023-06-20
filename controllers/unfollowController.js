const Followers = require('../models/Followers');
const Users = require('../models/Users');


const unfollow = async (req, res) => {
    const followerID = req.userID;
    const followingID = req.params.followingID;

    const existedUser = await Users.findOne({ userID: followerID });

    if (!existedUser) {
        return res.status(404).json({
            error: true,
            message: "User does not exist"
        });
    }

    const existedFollower = await Followers.findOne({ follower: followerID }, { following: followingID });

    if (!existedFollower) {
        return res.status(404).json({
            message: "User was not added as a follower"
        });
    }

    try {
        await Followers.deleteOne({ $and: [{ follower: followerID }, { following: followingID }] });
        return res.status(200).json({
            success: true,
            message: "User unfollowed succcessfully"
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
}

module.exports = {
    unfollow
};