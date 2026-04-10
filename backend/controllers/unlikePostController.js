const Likes = require('../models/Likes');
const Post = require('../models/Post');

const unlikePost = async (req, res) => {
    const author = req.params.userID;
    const postId = req.params.postId;

    const loggedInUserID = req.userID;

    const foundPost = await Post.findOne({ $and: [{ userID: author }, { postId: postId }] });

    if (!foundPost) {
        return res.status(404).json({
            error: true,
            message: "Post not found"
        })
    }

    const foundLike = await Likes.findOne({ $and: [{ userID: loggedInUserID }, { postId: postId }] });

    if (!foundLike) {
        return res.status(404).json({
            message: "post hasn't been liked yet"
        })
    }

    try {
        const result = await foundLike.deleteOne();
        foundPost.likes = await foundPost.likes - 1;
        await foundPost.save();

        return res.status(200).json({
            message: "like removed"
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            error: true,
            message: "Server Error"
        })
    }

}

module.exports = {
    unlikePost
};