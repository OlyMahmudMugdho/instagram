const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const likesSchema = new Schema({
    userID: {
        type: String,
        required: true
    },
    author : {
        type : String,
        required : true
    },
    postId: {
        type: String,
        required: true
    },
    likedAt: {
        type: Date,
        default: Date.now()
    }
});


module.exports = mongoose.model('Likes', likesSchema);