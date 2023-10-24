const Posts = require('../models/Post');
const Photo = require('../models/Photo');

const myPosts = async (req, res) => {
    const userID = req.userID;

    let fetchedPosts = await Posts.find({ userID: userID });



    try {
        let postData = [];
        for (const item of fetchedPosts) {
            let obj = item;
            obj.imageUrl = [];
            const foundImages = await Photo.find({ $and: [{ userID: item.userID }, { postId: item.postId }] });
            foundImages.forEach(img => obj.imageUrl.push(img.imageUrl));
            // obj.imageUrl = await foundImages;
            postData.push(obj);
            console.log(item.content);
        };


        return res.status(200).json(
            {
                data: await postData
            }
        )
    }
    catch (error) {
        console.log(error)
    }

}

module.exports = {
    myPosts
}