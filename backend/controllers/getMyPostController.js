const Posts = require('../models/Post');
const Photo = require('../models/Photo');
const Users = require('../models/Users');
const Friend = require('../models/Friend');

const myPosts = async (req, res) => {
    const loggedInUserID = req.userID;
    const targetUserID = req.query.userID || loggedInUserID;

    // If fetching someone else's posts, check friendship
    if (targetUserID !== loggedInUserID) {
        const friendship = await Friend.findOne({
            $or: [
                { sender: loggedInUserID, receiver: targetUserID },
                { sender: targetUserID, receiver: loggedInUserID }
            ],
            status: 'accepted'
        });

        if (!friendship) {
            return res.status(403).json({
                error: true,
                message: "You must be friends to see these posts"
            });
        }
    }

    const fetchedPosts = await Posts.find({ userID: targetUserID }).sort({ date : -1 }).lean();
 
    try {
        const postData = [];
        for (const item of fetchedPosts) {
            const foundImages = await Photo.find({ userID: item.userID, postId: item.postId });
            const imageUrls = foundImages.map(img => img.imageUrl);
            
            const user = await Users.findOne({ userID: item.userID });

            postData.push({
                _id: item._id,
                postId: item.postId,
                userId: item.userID,
                username: user?.username || 'User',
                avatar: user?.profilePicture || '',
                image: imageUrls[0] || '',
                title: item.content,
                description: item.content,
                likes: 0, // Should be fetched from Likes model if needed
                comments: 0, // Should be fetched from Comment model if needed
                createdAt: item.date
            });
        }

        return res.status(200).json({
            success: true,
            posts: postData,
            data: postData // Keeping data for backward compatibility
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: true, message: "Internal server error" });
    }
}

module.exports = {
    myPosts
}
