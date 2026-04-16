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

    const existedFollower = await Followers.findOne({ follower: followerID, following: followingID });

    if (!existedFollower) {
        return res.status(404).json({
            message: "User was not added as a follower"
        });
    }

    try {
        await Followers.deleteOne({ _id: existedFollower._id });

        // Update following count for the logged in user
        const loggedUser = await Users.findOne({ userID: followerID });
        if (loggedUser) {
            loggedUser.following = Math.max(0, (loggedUser.following || 0) - 1);
            await loggedUser.save();
        }

        // Update followers count for the user being unfollowed
        const targetUser = await Users.findOne({ userID: followingID });
        if (targetUser) {
            targetUser.followers = Math.max(0, (targetUser.followers || 0) - 1);
            await targetUser.save();
        }

        return res.status(200).json({
            success: true,
            message: "User unfollowed successfully"
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