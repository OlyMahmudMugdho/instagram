const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const followerSchema = new Schema({
    follower: {
        type: String,
        required: true
    },
    following: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});


module.exports = mongoose.model('Followers', followerSchema);