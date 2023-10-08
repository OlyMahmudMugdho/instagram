const Users = require('../models/Users');
const Posts = require('../models/Post');
const uuid = require('uuid');

const createPost = async (req, res) => {
    const { content, image } = req.body;
    console.log(await req.userID + "from here");
    const userID = await req.userID
    const PROTOCOL = 'https';
    const SERVER = 'instagram-cx9j.onrender.com';
    const PORT = 5000;

    const ADRESS = PROTOCOL + '://' + SERVER;

    let imageUrl = [];

    req.files.map(file => imageUrl.push(ADRESS + '/files/' + file.filename));


    console.log(imageUrl);
    console.log(content);

    const foundUser = await Users.findOne({ userID: userID }).exec();
    
    if(await foundUser) {
        console.log("found")
    }

    const name = await foundUser.name;

    try {

        const newPost = await Posts.create({
            content: content,
            imageUrl: imageUrl,
            author: name,
            userID: userID,
            postId: uuid.v4(),
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
