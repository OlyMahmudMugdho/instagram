const Users = require('../models/Users');
const Followers = require('../models/Followers')

const getRandomUsers = async (req, res) => {

    const userID = req.userID;

    const fetchedFollowingUsers = await Followers.find({ follower : userID });

    let followedUsers = [];

    const selfIndex = followedUsers.indexOf(userID);


    fetchedFollowingUsers.map(
        user => followedUsers.push(user.following)
    )

    
    /* const fetchedUsers = await Users.aggregate([ { $match : { $nor : [{ userID :  { $in : followedUsers} }]} } ,{ $sample: { size: 3 } } ]); */

    const fetchedUsers = await Users.aggregate([ { $match : { $nor : [{ userID :  { $in : [...followedUsers, userID]} }]} } ,{ $sample: { size: 3 } } ]);


    let userIDs = [];
    let usernames = [];
    let names = [];

    fetchedUsers.map(user => userIDs.push(user.userID) && usernames.push(user.username) && names.push(user.name))

    console.log(names);

    return res.status(200).json({
        success: true,
        data: {
            "userIDs": userIDs,
            "usernames": usernames,
            "names": names
        }
    })
}

module.exports = {
    getRandomUsers
}