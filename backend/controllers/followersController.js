const Followers = require('../models/Followers');
const Users = require('../models/Users');
const Friend = require('../models/Friend');

const follow = async (req, res) => {
    const followerID = req.userID;
    const followingID = req.params.followingID;

    if (!followingID || followerID === followingID) {
        return res.status(400).json({
            error: true,
            message: "Invalid following ID"
        });
    }

    try {
        const existedUser = await Users.findOne({ userID: followingID });
        if (!existedUser) {
            return res.status(404).json({
                error: true,
                message: "User to follow not found"
            });
        }

        // We check if we should create a friend request FIRST or independently of the follow status
        // This handles cases where someone was followed before the request logic was added
        const existingFriendship = await Friend.findOne({ 
            $or: [
                { sender: followerID, receiver: followingID },
                { sender: followingID, receiver: followerID }
            ]
        });

        let requestSent = false;
        if (!existingFriendship) {
            const newRequest = new Friend({ 
                sender: followerID, 
                receiver: followingID, 
                status: 'pending' 
            });
            await newRequest.save();
            requestSent = true;
        }

        const existedFollower = await Followers.findOne({ follower: followerID, following: followingID });
        if (existedFollower) {
            return res.status(200).json({
                success: true,
                message: requestSent ? "Friend request sent (already following)" : "Already followed and request exists"
            });
        }

        // Create follow relationship
        await Followers.create({
            follower: followerID,
            following: followingID
        });

        // Update counts
        const loggedUser = await Users.findOne({ userID: followerID });
        if (loggedUser) {
            loggedUser.following = (loggedUser.following || 0) + 1;
            await loggedUser.save();
        }

        existedUser.followers = (existedUser.followers || 0) + 1;
        await existedUser.save();

        return res.status(200).json({
            success: true,
            message: "Followed and friend request sent"
        });

    } catch (error) {
        console.error("Follow error:", error);
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
}

module.exports = {
    follow
};
