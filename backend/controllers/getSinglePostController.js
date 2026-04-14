const Post = require('../models/Post');
const Users = require('../models/Users');
const Photo = require('../models/Photo');

const getSinglePost = async (req, res) => {
    const postId = req.params.id;
    
    if (!postId) {
        return res.status(400).json({
            success: false,
            message: "post ID is required"
        });
    }
    
    try {
        const foundPost = await Post.findById(postId);
        
        if (!foundPost) {
            return res.status(404).json({
                success: false,
                message: "post not found"
            });
        }

        const user = await Users.findOne({ userID: foundPost.userID });
        const photo = await Photo.findOne({ postId: foundPost.postId });
        
        let displayImage = '';
        if (photo && photo.imageUrl && photo.imageUrl.startsWith('http')) {
            displayImage = photo.imageUrl;
        } else if (foundPost.imageUrl && foundPost.imageUrl.length > 0) {
            displayImage = foundPost.imageUrl[0];
        }
        
        return res.status(200).json({
            success: true,
            post: {
                _id: foundPost._id,
                postId: foundPost.postId,
                userId: foundPost.userID,
                username: user?.username || foundPost.author,
                avatar: user?.profilePicture || '',
                image: displayImage,
                title: foundPost.content,
                description: '',
                likes: foundPost.likes,
                comments: foundPost.comments,
                createdAt: foundPost.date,
                isLiked: false
            }
        });
    } catch (error) {
        console.error("Single post error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { getSinglePost };