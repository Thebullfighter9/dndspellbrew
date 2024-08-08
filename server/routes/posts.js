const express = require('express');
const Post = require('../models/post');
const router = express.Router();

router.get('/', (req, res) => {
    Post.find().sort({ created_at: -1 }).limit(10).then(posts => {
        res.json(posts);
    });
});

router.post('/', (req, res) => {
    const newPost = new Post(req.body);
    newPost.save().then(post => {
        res.json(post);
    });
});

module.exports = router;
