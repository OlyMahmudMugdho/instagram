const Comments = require('../models/Comment');
const Posts = require('../models/Post');
const Followers = require('../models/Followers');
const uuid = require('uuid');

const editComment = async (req, res) => {
    const loggedInUser = req.userID;
    const author = req.params.postUserID;
    const postId = req.params.postId;
    const commentID = req.params.commentID;
    const comment = req.body.comment;



    if (!author || !postId || !commentID) {
        return res.status(404).json({
            error: true,
            message: "author, postId or commentID is empty"
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

    const foundComment = await Comments.findOne({ $and: [{ commentID: commentID }, { postId: postId }, { author: author }] });

    if (!foundComment) {
        return res.status(404).json({
            error: true,
            message: "comment not found"
        });
    }

    const commentor = foundComment.commentor;

    const validUser = (commentor === loggedInUser) ? true : false;

    if (!validUser) {
        return res.status(404).json({
            error: true,
            message: "You are not the author of this comment"
        });
    }

    try {
        foundComment.comment = await comment;

        await foundComment.save();

        return res.status(200).json({
            success: true,
            message: "comment updated successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: true,
            message: "server error"
        });
    }

}


module.exports = {
    editComment
};