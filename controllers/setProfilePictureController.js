const User = require('../models/Users');


const setProfilePicture = async (req,res) => {
    const image = req.profilePic;
    const userID = req.userID;

    if(!image) {
        return res.status(500).json({
            error : true,
            message : "select an image"
        })
    }

    const foundUser = await User.findOne({ userID : userID });

    if(!foundUser) {
        return res.status(404).json({
            error : true,
            message : "user not found"
        })
    }

    
    foundUser.profilePicture = await image;
    await foundUser.save();

    return res.status(200).json({
        success : true,
        message : "profile picture added",
        image : image
    })

}

module.exports = {
    setProfilePicture
}