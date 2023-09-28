
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
        $or : [
            {name: { $regex: searchQuery, $options: 'i' }},
            {username : {$regex : searchQuery}}
        ]

    });

    let foundNames = [];
    let foundUsernames = [];

    await foundMatched.map( result => foundNames.push(result.name) && foundUsernames.push(result.username))

    console.log(await foundMatched);

    return res.status(200).json({
        success: true,
        result: {
            names : foundNames,
            usernames : foundUsernames
        }
    })
}

module.exports = {
    search
}

