const Followers = require('../models/Followers');

const checkFollowingStatus = async (followingParamName) => {
    const followerID = req.userID;
    const followingID = req.params.followingParamName;

    const existedFollower = await Followers.findOne({ $and: [{ follower: followerID }, { following: followingID }] })

    async (req, res) => {
        if (!existedFollower) {
            return res.status(404).json({
                error: true,
                message: "You are not a follower of the user"
            })
        }

        next();
    }
}

module.exports = checkFollowingStatus;