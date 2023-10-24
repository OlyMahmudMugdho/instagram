const Followers = require('../models/Followers');
const Post = require('../models/Post');
const Photo = require('../models/Photo');


const getSinglePost = async (req, res) => {
    const userID = req.params.postUserID;
    const postId = req.params.postId;
    const loggedInUser = req.userID;

    if (!userID || !postId) {
        return res.status(404).json({
            error: true,
            message: "userID and postID are required"
        });
    }

    const loggedUser = (userID === loggedInUser) ? true : false;

    const existedFollower = await Followers.findOne({ $and: [{ follower: req.userID }, { following: userID }] });

    if (!existedFollower && !loggedUser) {
        return res.status(403).json({
            error: true,
            message: "you are not following the user"
        });
    }

    const foundPost = await Post.findOne({ userID: userID, postId: postId });

    if (!foundPost) {
        return res.status(404).json({
            error: "true",
            message: "post not found"
        });
    }

    try {

        let obj = await foundPost;

        console.log(obj);

        obj.imageUrl = [];

        const foundImages = await Photo.find({ $and: [{ userID: userID }, { postId: postId }] });
        console.log(await foundImages);
        foundImages.forEach(img => obj.imageUrl.push(img.imageUrl));

        return res.status(200).json({
            success: true,
            data: obj
        });
    }
    catch (error) {
        console.log(error)
    }


}

module.exports = {
    getSinglePost
};