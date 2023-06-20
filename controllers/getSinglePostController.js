const Followers = require('../models/Followers');
const Post = require('../models/Post');

const getSinglePost = async (req, res) => {
    const userID = req.params.postUserID;
    const postId = req.params.postId;
    const loggedInUser = req.userID;

    if (!userID || !postId) {
        return res.status(404).json({
            error: true,
            message: "userID and postID are required"
        });
    }

    const loggedUser = (userID === loggedInUser) ? true : false;

    const existedFollower = await Followers.findOne({ $and: [{ follower: req.userID }, { following: userID }] });

    if (!existedFollower && !loggedUser) {
        return res.status(403).json({
            error: true,
            message: "you are not following the user"
        });
    }

    const foundPost = await Post.findOne({ userID: userID, postId: postId });

    if (!foundPost) {
        return res.status(404).json({
            error: "true",
            message: "post not found"
        });
    }

    return res.status(200).json({
        success: true,
        data: foundPost
    });
}

module.exports = {
    getSinglePost
};