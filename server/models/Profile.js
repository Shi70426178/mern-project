const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: '/assets/logo192.png'
    },
    wallet: {
        type: Number,
        default: 0 // Default balance is 0
    }
});

module.exports = mongoose.model('Profile', ProfileSchema);
