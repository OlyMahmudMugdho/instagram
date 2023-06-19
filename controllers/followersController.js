const Followers = require('../models/Followers');
const Users = require('../models/Users');

const follow = async (req, res) => {
    const followerID = req.userID;
    const followingID = req.params.followingID;

    if (!followingID) {
        return res.status(404).json({
            error: true,
            message: "following ID is required"
        });
    }

    const existedUser = await Users.findOne({ userID: followingID });

    if (!existedUser) {
        return res.status(404).json(
            {
                error: true,
                message: "USer not found"
            }
        );
    }

    const existedFollower = await Followers.findOne({ $and: [{ follower: followerID }, { following: followingID }] });

    if (existedFollower) {
        return res.status(202).json({
            message: "already followed"
        });
    }

    try {
        const newFollower = await Followers.create({
            follower: followerID,
            following: followingID
        })

        await newFollower.save();

        return res.status(200).json({
            success: true,
            message: "followed"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }

}


module.exports = {
    follow
};