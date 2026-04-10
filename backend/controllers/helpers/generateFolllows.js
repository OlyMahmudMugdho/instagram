const Followers = require('../../models/Followers');
const Users = require('../../models/Users')

const generate = async (req, res) => {
    const userID = req.userID;

    let allFollowers = [];
    let allFollowings = [];
    let count = [];

    const fetchedUsers = await Followers.find({});

    if (! await fetchedUsers) {
        return res.sendStatus(404)
    }

    await fetchedUsers.map(item => {
        if (!(allFollowers.includes(item.follower))) {
            allFollowers.push(item.follower)
        }

        if (!(allFollowings.includes(item.following))) {
            allFollowings.push(item.following)
        }
    })


    allFollowers.map(async item => {
        let num = [...await Followers.find({ follower: item })].length;

        foundUser = await Users.findOne({ userID : item });
        foundUser.following = await num;

        await foundUser.save();
    })


    allFollowings.map(async item => {
        let num = [...await Followers.find({ following: item })].length;

        foundUser = await Users.findOne({ userID : item });
        foundUser.followers = await num;

        await foundUser.save();

        console.log(await num)
        count.push(await num)

        console.log(await count)
    })

    return res.status(200).json({
        success: true,
        data: {
            "allFollowers": allFollowers,
            "allFollowings": allFollowings,
        }
    })

}

module.exports = {
    generate
}