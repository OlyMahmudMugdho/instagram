const Comments = require('../models/Comment');
const Posts = require('../models/Post');
const Followers = require('../models/Followers');

const deleteComment = async (req, res) => {
    const author = req.params.postUserID;
    const postId = req.params.postId;
    const commentID = req.params.commentID;

    const loggedInUser = req.userID;

    if (!author || !postId || !commentID) {
        return res.status(404).json({
            error: true,
            message: "authorID, postID and commentID is required"
        });
    }


    const postAuthor = (author === loggedInUser) ? true : false;
    const existedFollower = await Followers.findOne({ $and: [{ follower: loggedInUser }, { following: author }] });

    if (!existedFollower && !postAuthor) {
        return res.status(403).json({
            error: true,
            message: "you are not following the person"
        });
    }

    const foundPost = await Posts.findOne({ $and: [{ userID: author }, { postId: postId }] });

    if (!foundPost) {
        return res.status(404).json({
            error: true,
            message: "post not found"
        });
    }

    const foundComment = await Comments.findOne({ $and: [{ author: author }, { postId: postId }, { commentID: commentID }] });

    if (!foundComment) {
        return res.status(404).json({
            error: true,
            message: "comment not found"
        });
    }

    const commentAuthor = foundComment.commentor;

    const matchedCommentDeletor = ((commentAuthor === loggedInUser || (postAuthor))) ? true : false;

    if (!matchedCommentDeletor) {
        return res.status(403).json({
            error: true,
            message: "you cannot delete this comment"
        });
    }

    try {
        await foundComment.deleteOne();
        return res.status(200).json({
            success: true,
            message: "comment deleted successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            error: true,
            message: "internal server error"
        });
    }

}


module.exports = {
    deleteComment
};