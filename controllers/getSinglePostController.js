const Post = require('../models/Post');

const getSinglePost = async (req, res) => {
    const userID = req.params.postUserID;
    const postId = req.params.postId;


    const foundPost = await Post.findOne({ userID: userID, postId: postId });

    if (!foundPost) {
        return res.status(404).json({
            error: "true",
            message: "post not found"
        });
    }

    return res.status(200).json({
        data: foundPost
    });
}

module.exports = {
    getSinglePost
};