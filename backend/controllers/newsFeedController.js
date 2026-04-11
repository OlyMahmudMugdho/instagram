const Posts = require('../models/Post');
const Followers = require('../models/Followers');
const Comments = require('../models/Followers');


const getFeed = async (req, res) => {
    try {
        const Posts = require('../models/Post');
        const Photos = require('../models/Photo');
        
        const foundPosts = await Posts.find().sort({ date: -1 }).limit(50);
        
        const posts = await Promise.all(foundPosts.map(async (post) => {
            const photo = await Photos.findOne({ postId: post.postId });
            return {
                _id: post._id,
                postId: post.postId,
                userId: post.userID,
                username: post.author,
                avatar: '',
                image: photo?.imageUrl || '',
                title: post.content,
                description: '',
                likes: post.likes,
                comments: post.comments,
                createdAt: post.date,
                isLiked: false
            };
        }));
        
        return res.status(200).json({ success: true, posts });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    getFeed
};