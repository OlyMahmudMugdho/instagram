const Post = require('../models/Post');
const uuid = require('uuid');

const createPost = async (req, res) => {
    const postContent = await req.body.content;
    const newPost = await Post.create({
        content: postContent,
        author: req.author,
        postId: uuid.v4()
    }
    );

    await newPost.save();
    return res.status(200).json(
        {
            "message": "post created",
            "data": newPost
        }
    )
}

module.exports = {
    createPost
};