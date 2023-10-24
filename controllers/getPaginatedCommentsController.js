const Comment = require('../models/Comment');
const Followers = require('../models/Followers');
const Post = require('../models/Post');


const getPaginatedComments = async (req, res) => {
    const author = req.params.postUserID;
    const postId = req.params.postId;
    const page = parseInt(req.params.page);

    console.log(author)
    console.log(postId)
    console.log(page)
    const loggedInUserID = req.userID;

    if (!author || !postId || !page) {
        return res.status(404).json({
            error: true,
            message: "author and postId fields are empty"
        });
    }

    const isRealAuthor = (author === loggedInUserID) ? true : false;

    const isFollower = await Followers.findOne({ $and: [{ follower: loggedInUserID }, { following: author }] });

    if (!isFollower && isRealAuthor) {
        return res.status(403).json({
            error: true,
            message: "You are not a follower of this user"
        });
    }

    const foundPost = await Post.findOne({ $and: [{ userID: author }, { postId: postId }] });

    if (!foundPost) {
        return res.status(404).json({
            error: true,
            message: "post not found"
        });
    }



    const foundComments = await Comment.find({ $and: [{ author: author }, { postId: postId }] });


    if (!foundComments) {
        return res.status(404).json({
            error: true,
            message: "comments not found"
        });
    }

    const commentsInPage = 3;
    const totalComments = await foundComments.length;
    let extraPage;

    ((totalComments % commentsInPage) == 0) ? extraPage = 0 : extraPage = 1;

    const totalPages = parseInt((totalComments / commentsInPage)) + extraPage;
    console.log(totalPages)

    if (page >= totalPages || page <= 0) {
        return res.status(404).json({
            end: true,
            error: true,
            message: 'page not found'
        })
    }

    const lastIndex = (page * commentsInPage) - 1;
    const startingIndex = (lastIndex - commentsInPage) + 1;
    const indexToSkip = startingIndex - 1;

    const resData = [];
    let count = startingIndex;

    for (const item of foundComments) {
        resData.push(item);
        count++;

        if (count == lastIndex) {
            break;
        }
    }

    return res.status(200).json({
        success: true,
        data: resData
    });
}


module.exports = {
    getPaginatedComments
};