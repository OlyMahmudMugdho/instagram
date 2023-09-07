const Post = require('../models/Post');
const uuid = require('uuid');
const path = require('path');
const PORT = process.env.PORT || 5000;

const createPost = async (req, res) => {
    const {content} = await req.body;
    // const images = req.body.files;
    const author = req.author;
    const userID = req.userID;
    const postId = uuid.v4();

    let imageUrl;
        console.log(content)
        console.log(await req.body)
        
    /* if (!images) {
        return res.status(404).json({
            error: true,
            message: "no item selected"
        });
    }
 */
/*     Object.keys(images).forEach(
        (key) => {
            const fileName = images[key].name;
            const filePath = path.join('files', 'posts', userID, author, postId, fileName);
            imageUrl = 'http://localhost:' + PORT + '/' + filePath;

            images[key].mv(filePath, (error) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({
                        error: true,
                        message: "error from server"
                    });
                }
            });
        }
    ) */


    try {
        const newPost = await Post.create({
            content: content,
            imageUrl: imageUrl,
            author: req.author,
            userID: req.userID,
            postId: postId,
            likes: 0,
            comments: 0
        });

        await newPost.save();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "error due to mongodb"
        });
    }
    return res.status(200).json(
        {
            message: "post created"
        }
    );
}


module.exports = {
    createPost
};