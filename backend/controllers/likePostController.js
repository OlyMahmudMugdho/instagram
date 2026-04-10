const Likes = require('../models/Likes');
const Post = require('../models/Post');

const likePost = async (req, res) => {
    const author = req.params.userID;
    const postId = req.params.postId;

    const loggedInUserID = req.userID;

    const foundPost = await Post.findOne({ $and: [{ userID: author }, { postId: postId }] });

    if (!foundPost) {
        return res.status(404).json({
            error: true,
            message: "post not found"
        })
    }

    const foundLike = await Likes.findOne({ $and: [{ userID: loggedInUserID }, { postId: postId }] });

    if (foundLike) {
        return res.status(200).json({
            message: "post was already liked"
        })
    }

    const createdLike = await Likes.create({
        userID: loggedInUserID,
        author: author,
        postId: postId
    });

    await createdLike.save();

    let prevLike = parseInt(await foundPost.likes);

    foundPost.likes =  Number(prevLike) + 1;
    await foundPost.save();

    return res.status(200).json({
        success: true,
        message: "Post Liked"
    });


}

module.exports = {
    likePost
};