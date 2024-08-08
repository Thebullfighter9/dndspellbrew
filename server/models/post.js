const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: String,
    description: String,
    imageUrl: String,
    type: String, // 'spell', 'character', 'npc'
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', postSchema);
