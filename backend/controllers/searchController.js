
const Users = require('../models/Users');

const search = async (req, res) => {
    const searchQuery = req.query.q;
    console.log(searchQuery)
    if (!search) {
        return res.status(404).json({
            error: true,
            message: "found nothing"
        })
    }

    const foundMatched = await Users.find({
        $or: [
            { name: { $regex: `${searchQuery}`, $options: 'i' } },
            { username: { $regex: `${searchQuery}` } }
        ]

    });

    let foundNames = [];
    let foundUsernames = [];
    let foundUserIDs = [];

    await foundMatched.map(result => (foundUserIDs.includes(req.userID)) ? null : foundNames.push(result.name) && foundUsernames.push(result.username) && foundUserIDs.push(result.userID) );

    console.log(await foundMatched);

    if (await foundNames.length === 0) {
        return res.status(200).json({
            success: true,
            empty: true,
            result: "found nothing"
        })
    }

    return res.status(200).json({
        success: true,
        empty : false,
        result: {
            names: foundNames,
            usernames: foundUsernames,
            userIDs: foundUserIDs
        }
    })
}

module.exports = {
    search
}

