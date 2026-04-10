const Post = require('../models/Post');
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
        
        const photos = await Photo.find({ postId: foundPost.postId });
        
        return res.status(200).json({
            success: true,
            post: {
                _id: foundPost._id,
                userId: foundPost.userID,
                username: foundPost.author,
                avatar: '',
                image: photos[0]?.imageUrl || '',
                title: foundPost.content,
                description: '',
                likes: foundPost.likes,
                comments: foundPost.comments,
                createdAt: foundPost.date,
                isLiked: false
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { getSinglePost };