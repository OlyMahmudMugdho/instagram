const Users = require('../models/Users');
const Friend = require('../models/Friend');

const suggestUsers = async (req, res) => {
    try {
        const userID = req.userID;
        
        // Find friends to exclude
        const friends = await Friend.find({
            $or: [{ sender: userID }, { receiver: userID }],
            status: 'accepted'
        });
        
        const friendIDs = friends.map(f => f.sender === userID ? f.receiver : f.sender);
        
        // Exclude current user and friends
        const excludeIDs = [...friendIDs, userID];
        
        // Find random users not in exclude list
        const suggested = await Users.aggregate([
            { $match: { userID: { $nin: excludeIDs } } },
            { $sample: { size: 5 } },
            { $project: { username: 1, name: 1, userID: 1, profilePicture: 1 } }
        ]);

        return res.status(200).json({ success: true, suggested });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { suggestUsers };
