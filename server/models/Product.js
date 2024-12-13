const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    fileUrl: { type: String, required: true },
    username: { type: String, required: true },
    isPremium: { type: Boolean, default: false },
    price: { type: Number, required: function() { return this.isPremium; } }, // Add price field
    likes: { type: Number, default: 0 },
    likedBy: { type: [String], default: [] },
    comments: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
