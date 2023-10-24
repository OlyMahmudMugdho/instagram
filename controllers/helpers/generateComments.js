const Comments = require('../../models/Comment');
const Posts = require('../../models/Post')

const generateComments = async (req, res) => {
    const userID = req.userID;


    try {
        let postIds = [];
        let userIDs = [];

        const foundPosts = await Posts.find({});

        for (const item of foundPosts) {
            userIDs.push(item.userID);
            postIds.push(item.postId);
        }

        postIds.map(async (item, key) => {
            const foundComments = await Comments.find({ $and: [{ postId: item }, { userID: userIDs[key] }] });
            let num = await foundComments.length;

            const foundPost = await Posts.findOne({ $and: [{ postId: item }, { userID: userIDs[key] }] });
            console.log(await foundPost.length)
            foundPost.comments = await foundPost.length || 0;
            await foundPost.save();
        })

        return res.status(200).json({
            success: true,
            data: {
                "postIds": postIds,
                "userIDs": userIDs,
            }
        })
    }

    catch (error) {
        return res.status(500).json({
            "error": error
        })
    }


}

module.exports = {
    generateComments
}