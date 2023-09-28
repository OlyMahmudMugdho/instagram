const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema(
    {
        userID: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        profilePicture : {
            type : String,
            default : null
        },
        refreshToken: {
            type: String,
            default: ""
        },
        resetCode : {
            type : String,
            expires : 3600
        }
    }
)

module.exports = mongoose.model('Users', userSchema);
