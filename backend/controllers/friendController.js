const Friend = require('../models/Friend');
const Users = require('../models/Users');
const Followers = require('../models/Followers');

const sendRequest = async (req, res) => {
    const sender = req.userID;
    const { receiver } = req.body;

    if (!receiver || sender === receiver) {
        return res.status(400).json({ error: true, message: "Invalid receiver" });
    }

    const existing = await Friend.findOne({ 
        $or: [
            { sender, receiver },
            { sender: receiver, receiver: sender }
        ]
    });

    if (existing) {
        return res.status(400).json({ error: true, message: "Request already exists" });
    }

    await Friend.create({ sender, receiver });
    res.status(200).json({ success: true, message: "Request sent" });
};

const acceptRequest = async (req, res) => {
    const receiver = req.userID;
    const { sender } = req.body;

    const request = await Friend.findOne({ sender, receiver, status: 'pending' });

    if (!request) {
        return res.status(404).json({ error: true, message: "Request not found" });
    }

    request.status = 'accepted';
    await request.save();

    // The one who accepts follows back the sender
    const alreadyFollowing = await Followers.findOne({ follower: receiver, following: sender });
    if (!alreadyFollowing) {
        await Followers.create({ follower: receiver, following: sender });

        // Update counts
        const receiverUser = await Users.findOne({ userID: receiver });
        if (receiverUser) {
            receiverUser.following = (receiverUser.following || 0) + 1;
            await receiverUser.save();
        }

        const senderUser = await Users.findOne({ userID: sender });
        if (senderUser) {
            senderUser.followers = (senderUser.followers || 0) + 1;
            await senderUser.save();
        }
    }

    res.status(200).json({ success: true, message: "Request accepted and followed back" });
};

const getFriends = async (req, res) => {
    const userID = req.userID;
    const friends = await Friend.find({
        $or: [{ sender: userID }, { receiver: userID }],
        status: 'accepted'
    });
    
    const friendIDs = friends.map(f => f.sender === userID ? f.receiver : f.sender);
    res.status(200).json({ success: true, friends: friendIDs });
};

const getReceivedRequests = async (req, res) => {
    const userID = req.userID;
    const requests = await Friend.find({
        receiver: userID,
        status: 'pending'
    });
    
    const detailedRequests = await Promise.all(requests.map(async (req) => {
        const sender = await Users.findOne({ userID: req.sender });
        return {
            ...req.toObject(),
            sender: {
                username: sender?.username,
                name: sender?.name,
                profilePicture: sender?.profilePicture,
                userID: sender?.userID
            }
        };
    }));
    
    res.status(200).json({ success: true, requests: detailedRequests });
};

module.exports = { sendRequest, acceptRequest, getFriends, getReceivedRequests };
