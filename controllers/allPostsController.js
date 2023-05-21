const db = {
    posts: require('../models/posts.json'),
    setData: function (data) {
        this.posts = data;
    }
}

const showAllPosts = (req, res) => {
    return res.status(200).json(db.posts.map(post => post));
}

module.exports = {showAllPosts};