const User = require('../models/Users');
const cloudinary = require('cloudinary').v2;
const Photo = require('../models/Photo');
const fs = require('fs');

const setProfilePicture = async (req, res) => {
    const userID = req.userID;

    if (!req.file) {
        return res.status(400).json({
            error: true,
            message: "Please select an image"
        });
    }

    const foundUser = await User.findOne({ userID: userID });

    if (!foundUser) {
        return res.status(404).json({
            error: true,
            message: "User not found"
        });
    }

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'profile_pictures',
            resource_type: 'auto'
        });

        // Delete local file after successful upload to Cloudinary
        fs.unlink(req.file.path, (err) => {
            if (err) console.error("Error deleting local file:", err);
        });

        const photo = await Photo.create({
            imageUrl: result.secure_url,
            postId: "profilePicture",
            userID: userID
        });
        
        foundUser.profilePicture = result.secure_url;
        await foundUser.save();

        return res.status(200).json({
            success: true,
            message: "Profile picture updated successfully",
            image: result.secure_url
        });
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        // Delete local file even if upload fails
        if (req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Error deleting local file after failure:", err);
            });
        }
        return res.status(500).json({
            error: true,
            message: "Failed to upload image to Cloudinary"
        });
    }
};

module.exports = {
    setProfilePicture
}