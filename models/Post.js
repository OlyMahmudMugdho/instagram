const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        imageUrl: {
            type : String,
            required : true
        },
        author: {
            type: String,
            required: true
        },
        userID : {
            type : String,
            required : true
        },
        postId: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now()
        },
        likes: Number,
        comments: Number,
    }
);

module.exports = mongoose.model('Posts', postSchema);