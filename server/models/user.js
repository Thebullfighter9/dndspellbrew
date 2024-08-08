const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    bio: String,
    profilePicture: String,
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    recentActivities: [{
        text: String,
        date: Date
    }],
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
