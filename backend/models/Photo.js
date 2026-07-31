const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const photoSchema = new Schema(
    {
        imageUrl : {
            type : String,
            required : true
        },
        postId : {
            type : String,
            required : true
        },
        userID : {
            type : String,
            required : true
        }
    }
);

module.exports = mongoose.model('Photos',photoSchema);