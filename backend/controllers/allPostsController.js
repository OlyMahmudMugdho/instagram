const Posts = require('../models/Post'); 

const showAllPosts = async (req, res) => {
    const allPosts = await Posts.find();
    return res.status(200).json(
        {
            "data" : allPosts
        }
    );
}

module.exports = {showAllPosts};