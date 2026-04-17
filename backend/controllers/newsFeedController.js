const Posts = require('../models/Post');
const Users = require('../models/Users');
const Photo = require('../models/Photo');
const Friend = require('../models/Friend');
const Likes = require('../models/Likes');

const getFeed = async (req, res) => {
    const userID = req.userID;
    try {
        const friends = await Friend.find({
            $or: [{ sender: userID }, { receiver: userID }],
            status: 'accepted'
        });
        const friendIDs = friends.map(f => f.sender === userID ? f.receiver : f.sender);
        
        // Show only friends' posts + own posts
        const allowedIDs = [...friendIDs, userID];
        
        const foundPosts = await Posts.find({ userID: { $in: allowedIDs } }).sort({ date: -1 }).limit(50);
        
        const posts = await Promise.all(foundPosts.map(async (post) => {
            const user = await Users.findOne({ userID: post.userID });
            
            const photo = await Photo.findOne({ postId: post.postId });
            let displayImage = '';
            
            if (photo && photo.imageUrl && photo.imageUrl.startsWith('http')) {
                displayImage = photo.imageUrl;
            } else if (post.imageUrl && post.imageUrl.length > 0) {
                displayImage = post.imageUrl[0];
            }

            const liked = await Likes.findOne({ userID, postId: post.postId });

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
                isLiked: !!liked
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