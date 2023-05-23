/* const db = {
    posts: require('../models/posts.json'),
    setData: function (data) {
        this.posts = data;
    }
} */

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