const User = require('../models/Users');
const cloudinary = require('cloudinary');
const Photo = require('../models/Photo');

const setProfilePicture = async (req, res) => {
    const image = req.profilePic;
    const userID = req.userID;

    if (!image) {
        return res.status(500).json({
            error: true,
            message: "select an image"
        })
    }

    const foundUser = await User.findOne({ userID: userID });

    if (!foundUser) {
        return res.status(404).json({
            error: true,
            message: "user not found"
        })
    }

    console.log(req.file.path);

    cloudinary.config({
        cloud_name: 'dnmubeloc',
        api_key: '156698557795686',
        api_secret: '1mljPOjNWxfNYtjUMTcWIFQlu0Q'
    });


    cloudinary.uploader
        .upload(req.file.path)
        .then(async (result) => {
            try {
                const photo = await Photo.create({
                    imageUrl: result.url,
                    postId: "profilePicture",
                    userID: userID
                })
                await photo.save();
                console.log(result.url + " file cloudinary");


                foundUser.profilePicture = await result.url;
                await foundUser.save();

                return res.status(200).json({
                    success: true,
                    message: "profile picture added",
                    image: await result.url
                })
            }
            catch (error) {
                console.log(error);
            }
        })



}

module.exports = {
    setProfilePicture
}