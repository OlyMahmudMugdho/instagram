const Users = require('../models/Users');

const logOut = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies || !cookies.jwt) {
        return res.sendStatus(204);
    }

    const refreshToken = cookies.jwt;
    const foundUser = await Users.findOne({ refreshToken: refreshToken }).exec();

    if (!foundUser) {
        return res.status(204).clearCookie(
            'jwt'
        ).json(
            {
                "message": "user not found, cookie cleared"
            }
        );
    }


    foundUser.refreshToken = '';
    await foundUser.save();

    return res.status(204).clearCookie(
        'jwt',
        {
            httpOnly: true,
            expiresIn: '60*60*1000s'
        }
    ).json(
        {
            "message": "logged out succesfully"
        }
    )

}

module.exports = { logOut };