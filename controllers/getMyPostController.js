const Posts = require('../models/Post');


const myPosts = async (req, res) => {
    const userID = req.userID;

    const fetchedPosts = await Posts.find({ userID: userID });

    return res.status(200).json(
        {
            data: fetchedPosts
        }
    )

}

module.exports = {
    myPosts
}