const Comment = require('../models/Comment');
const Followers = require('../models/Followers');
const Post = require('../models/Post');


const getAllComments = async (req, res) => {
    const author = req.params.postUserID;
    const postId = req.params.postId;

    const loggedInUserID = req.userID;

    if (!author || !postId) {
        return res.status(404).json({
            error: true,
            message: "author and postId fields are empty"
        });
    }

    const isRealAuthor = (author === loggedInUserID) ? true : false;

    const isFollower = await Followers.findOne({ $and: [{ follower: loggedInUserID }, { following: author }] });

    if (!isFollower && isRealAuthor) {
        return res.status(403).json({
            error: true,
            message: "You are not a follower of this user"
        });
    }

    const foundPost = await Post.findOne({ $and: [{ userID: author }, { postId: postId }] });

    if (!foundPost) {
        return res.status(404).json({
            error: true,
            message: "post not found"
        });
    }

    const foundComments = await Comment.find({ $and: [{ author: author }, { postId: postId }] });

    if (!foundComments) {
        return res.status(404).json({
            error: true,
            message: "comments not found"
        });
    }

    return res.status(200).json({
        success: true,
        data: foundComments
    });
}


module.exports = {
    getAllComments
};