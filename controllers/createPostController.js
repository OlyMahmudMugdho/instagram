const Users = require('../models/Users');
const Posts = require('../models/Post');
const Photo = require('../models/Photo');
const uuid = require('uuid');
const cloudinary = require('cloudinary').v2;

const createPost = async (req, res) => {
    const { content, image } = req.body;
    console.log(await req.userID + "from here");
    const userID = await req.userID;
    const PROTOCOL = 'http';
    const SERVER = 'localhost';
    const PORT = 5000;

    const ADRESS = PROTOCOL + '://' + SERVER + ':' + PORT;

    let imageUrl = [];

    cloudinary.config({
        cloud_name: 'dnmubeloc',
        api_key: '156698557795686',
        api_secret: '1mljPOjNWxfNYtjUMTcWIFQlu0Q'
    });

    const postId = uuid.v4();

    // cloudinary.uploader.upload("../files/16945016681768d6e912c-46f6-42c8-8eab-2523be047256.jpg")

    req.files.map(img => {
        cloudinary.uploader
            .upload(img.path)
            .then(async (result) => {
                try {
                    const photo = await Photo.create({
                        imageUrl: result.url,
                        postId: postId,
                        userID: userID
                    })
                    await photo.save();
                    console.log(result.url + " file cloudinary");
                }
                catch (error) {
                    console.log(error);
                }
            })
    })

    req.files.map(file => imageUrl.push(ADRESS + '/files/' + file.filename));




    console.log(imageUrl);
    console.log(content);

    const foundUser = await Users.findOne({ userID: userID }).exec();

    if (await foundUser) {
        console.log("found")
    }

    const name = await foundUser.name;

    try {

        const newPost = await Posts.create({
            content: content,
            imageUrl: imageUrl,
            author: name,
            userID: userID,
            postId: postId,
        })

        await newPost.save();
    }
    catch (error) {
        console.log(error);
        console.log('error due to database');
        return res.status(500).json({
            error: true,
            message: 'internal server error'
        })
    }

    return res.status(200).json({
        sucess: true,
        message: "uploaded"
    })


}

module.exports = {
    createPost
}
