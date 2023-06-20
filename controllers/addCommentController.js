const Comments = require('../models/Comment');
const Posts = require('../models/Post');
const Followers = require('../models/Followers');
const uuid = require('uuid');

const addComment = async (req, res) => {
    const commentID = uuid.v4();
    const commentor = req.userID;
    const author = req.params.postUserID;
    const postId = req.params.postId;
    const comment = req.body.comment;

    if (!author || !postId) {
        return res.status(404).json({
            error: true,
            message: "author or post is empty"
        });
    }

    const loggedInUser = (commentor === author) ? true : false;
    const existedFollower = await Followers.findOne({ $and: [{ follower: commentor }, { following: author }] });

    if (!loggedInUser && !existedFollower) {
        return res.status(403).json({
            error: true,
            message: "you are not a follower"
        });
    }

    if (!comment) {
        return res.status(404).json({
            error: true,
            message: "comment field is empty"
        });
    }

    const foundPost = await Posts.findOne({ $and: [{ userID: author }, { postId: postId }] });

    if (!foundPost) {
        return res.status(404).json({
            error: true,
            message: "post not found"
        });
    }

    try {
        const newComment = await Comments.create({
            commentID: commentID,
            commentor: commentor,
            author: author,
            postId: postId,
            comment: comment
        });

        await newComment.save();

        foundPost.comments = await foundPost.comments + 1;
        foundPost.save();

        return res.status(200).json({
            success: true,
            message: "comment added to post successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: true,
            message: "internal server error"
        });
    }
}

module.exports = {
    addComment
};