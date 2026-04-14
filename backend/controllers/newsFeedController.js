const Posts = require('../models/Post');
const Users = require('../models/Users');
const Photo = require('../models/Photo');

const getFeed = async (req, res) => {
    try {
        const foundPosts = await Posts.find().sort({ date: -1 }).limit(50);
        
        const posts = await Promise.all(foundPosts.map(async (post) => {
            const user = await Users.findOne({ userID: post.userID });
            
            // Check for Cloudinary URL in Photo collection first
            const photo = await Photo.findOne({ postId: post.postId });
            let displayImage = '';
            
            if (photo && photo.imageUrl && photo.imageUrl.startsWith('http')) {
                displayImage = photo.imageUrl;
            } else if (post.imageUrl && post.imageUrl.length > 0) {
                // Use the first URL from post.imageUrl
                displayImage = post.imageUrl[0];
            }

            return {
                _id: post._id,
                postId: post.postId,
                userId: post.userID,
                username: user?.username || post.author,
                avatar: user?.profilePicture || '',
                image: displayImage,
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
        console.error("Feed error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    getFeed
};