const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String },
    wallet: { type: Number, default: 10000 }, // Initialize wallet with default value of 0
    isAdmin: { type: Boolean, default: false }, // Add isAdmin with a default value of false
});

module.exports = mongoose.model('User', userSchema);

