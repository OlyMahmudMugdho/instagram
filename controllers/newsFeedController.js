const Posts = require('../models/Post');
const Followers = require('../models/Followers');
const Comments = require('../models/Followers');


const getFeed = async (req, res) => {
    const userID = req.userID;
    const foundFollowing = await Followers.find({follower : userID});
    const followingIDs = await foundFollowing.map(
        item => item.following
    )

    console.log("from newsfeed controller");
    console.log(followingIDs);
    
    // const matchedFollowers =
    const foundPosts = await Posts.find({ userID : { $in : followingIDs } }).sort({ date : -1 });
    
    return res.status(200).json(foundPosts);
}

module.exports = {
    getFeed
};