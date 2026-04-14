const Users = require('../models/Users');
const Posts = require('../models/Post');
const Photo = require('../models/Photo');
const uuid = require('uuid');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const createPost = async (req, res) => {
    const { content } = req.body;
    const userID = req.userID;

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({
            error: true,
            message: "Please select at least one image"
        });
    }

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const postId = uuid.v4();
    const imageUrls = [];

    try {
        const foundUser = await Users.findOne({ userID: userID }).exec();
        if (!foundUser) {
            return res.status(404).json({ error: true, message: "User not found" });
        }

        // Upload all files to Cloudinary
        for (const file of req.files) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'posts',
                resource_type: 'auto'
            });

            // Cleanup local file
            fs.unlink(file.path, (err) => {
                if (err) console.error("Error deleting local file:", err);
            });

            imageUrls.push(result.secure_url);

            // Create Photo entry
            await Photo.create({
                imageUrl: result.secure_url,
                postId: postId,
                userID: userID
            });
        }

        const newPost = await Posts.create({
            content: content,
            imageUrl: imageUrls,
            author: foundUser.name,
            userID: userID,
            postId: postId,
        });

        await newPost.save();

        return res.status(200).json({
            success: true,
            message: "Post created successfully",
            post: newPost
        });

    } catch (error) {
        console.error("Create post error:", error);
        // Attempt to cleanup any remaining local files
        req.files.forEach(file => {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        });

        return res.status(500).json({
            error: true,
            message: 'Internal server error'
        });
    }
}

module.exports = {
    createPost
}
