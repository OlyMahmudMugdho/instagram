const Users = require('../models/Users');


const getRandomUsers = async (req, res) => {

    const fetchedUsers = await Users.aggregate([{ $sample: { size: 2 } }]);

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