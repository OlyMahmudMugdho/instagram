const Posts = require('../models/Post');
const Followers = require('../models/Followers');
const Photo = require('../models/Photo');
const { listeners } = require('../models/Users');
const getPaginatedPosts = async (req, res) => {

    const page = parseInt(req.params.page);
    
    const postsInPage = 3;


    console.log(req.userID)
    const userID = req.userID
    const following = await Followers.find({ follower: userID });
    let followingIDs = [];
    following.map(item => followingIDs.push(item.following));


    const totalPosts = await Posts.countDocuments({userID: { $in: followingIDs }});


    let extraPage;

    (((await totalPosts) % postsInPage) == 0) ? extraPage = 0 : extraPage = 1;

    

    const totalPages = parseInt((await totalPosts / postsInPage)) + await extraPage;
    console.log(totalPages)

    if ((page >= (await totalPages)) || (page <= 0)) {
        return res.status(404).json({
            end: true,
            error: true,
            message: 'page not found'
        })
    }

    const lastIndex = page * postsInPage;
    const startingIndex = (lastIndex - postsInPage) + 1;
    const indexToSkip = startingIndex - 1;


    let fetchedPosts = await Posts.find({ userID: { $in: followingIDs } }).skip(indexToSkip).limit(postsInPage);

    // const fetchedPosts = await Posts.find({ userID: { $in: followingIDs.following } })

    // const fetchedPosts = await Posts.find({ userID: followingIDs.following })

    console.log(await fetchedPosts + " line 41");

    try {
        let resData = [];

        for (const item of await fetchedPosts) {
            let obj = item;
            obj.imageUrl = [];
            const foundImages = await Photo.find({ $and: [{ userID: item.userID }, { postId: item.postId }] });
            await foundImages.forEach(async img => await obj.imageUrl.push(await img.imageUrl));
            await resData.push(await obj);
        };

        if (await resData.length === 0) {
            return res.status(404).json({
                end: true,
                error: true,
                message: 'page not found'
            })
        }

        return res.status(200).json({
            total: await totalPosts,
            pages: await totalPages,
            requested_page: page,
            data: await resData
        })
    }
    catch (error) {
        console.log(error);
    }
}


module.exports = {
    getPaginatedPosts
}










/*



******** PAGINATION ALGORITHM *********



--------------------------        FORMULAE         ---------------------------



total_page = int(total / posts_in_every_page) + (total % posts_in_every_page) = 24/3 = 8
end = requested_page * posts_in_every_page
start = (end - posts_in_every_page) + 1 = (6-3) + 1 = 4


______________________________________________________________________________________


*/