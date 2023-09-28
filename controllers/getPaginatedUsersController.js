const Users = require('../models/Users');

const getUsers = async (req, res) => {
    const requestedPage = req.params.page;
    if (requestedPage < 1 || !requestedPage) {
        return res.status(400).json({
            message: 'Invalid page number'
        });
    }
    const usersPerPage = 3;
    const totalUsers = await Users.countDocuments();
    let extraPages;
    ((totalUsers % usersPerPage) == 0) ? extraPages = 0 : extraPages = 1;
    const totalPages = parseInt((totalUsers / usersPerPage) + extraPages);

    if (requestedPage > totalPages) {
        return res.status(400).json({
            message: 'Invalid page number'
        });
    }

    const lastIndex = requestedPage * usersPerPage;
    const startingIndex = (lastIndex - usersPerPage) + 1;

    const indexToSkip = startingIndex - 1;

    const users = await Users.find().skip(indexToSkip).limit(usersPerPage);
    let userIDs = [];
    let usernames = [];
    let names = [];

    users.map((user) => userIDs.push(user.userID));
    users.map((user) => usernames.push(user.username));
    users.map((user) => names.push(user.name));

    console.log(userIDs);
    console.log(usernames);
    console.log(names);

    res.status(200).json({
        success: true,
        data: {
            userIDs: userIDs,
            usernames: usernames,
            names: names
        },
    });
}

module.exports = {
    getUsers
};