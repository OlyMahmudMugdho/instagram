const Post = require('../models/Post');

const editPost = async (req, res) => {
    const postUserID = req.params.postUserID;
    const postId = req.params.postId;
    const content = req.body.content;
    
    console.log({ userIDForPost: postUserID, userID: req.userID });

    if (postUserID !== req.userID) {
        return res.status(403).json({
            error: true,
            message: "unauthenticated"
        })
    }


    const foundPost = await Post.findOne({ $and: [{ userID: postUserID }, { postId: postId }] });

    if (!foundPost) {
        return res.status(404).json({
            error: "true",
            message: "post not found"
        });
    }

    if (!content) {
        return res.status(404).json({
            error: "true",
            message: "must write something to edit"
        });
    }

    foundPost.content = await content;

    await foundPost.save();

    return res.status(200).json({
        success : true,
        data: foundPost
    })
}

module.exports = {
    editPost
};
