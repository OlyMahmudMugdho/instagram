const Post = require('../models/Post');
const url = require('url');
const path = require('path');

const deletePost = async (req, res) => {
    const userID = req.params.postUserID;
    const postId = req.params.postId;

    const loggedUserID = req.userID;

    if (!userID || !postId) {
        return res.sendStatus(404)
    }



    if (loggedUserID != userID) {
        return res.status(403).json({
            error: true,
            message: "unauthenticated"
        });
    }

    const foundPost = await Post.findOne({ $and: [{ userID: loggedUserID }, { postId: postId }] });

    if (!foundPost) {
        return res.status(404).json({
            error: true,
            message: "no post found"
        });
    }

    try {
        const res = await foundPost.deleteOne();
    } catch (error) {
        console.log(error)
        return res.sendStatus(404)
    }

    return res.status(200).json({
        success: true,
        message: "post deleted successfully"
    })
}

module.exports = {
    deletePost
}