const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const friendSchema = new Schema({
    sender: {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Friend', friendSchema);