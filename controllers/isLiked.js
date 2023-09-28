const Likes = require('../models/Likes')

const checkisLiked = async (req, res) => {
    const userID = req.userID;
    const author = req.params.userID;
    const postId = req.params.postId;

    if (!author || !postId) {
        return res.status(404).json({
            error: true,
            message: "author and postId empty "
        })
    }

    const foundLiked = await Likes.findOne({ $and: [{ author: author }, { postId: postId }, { userID: userID }] })

    if (!foundLiked) {
        return res.status(404).json({
            error: true,
            liked: false
        })
    }

    return res.status(200).json({
        success: true,
        liked: true
    })
}

module.exports = {
    checkisLiked
}