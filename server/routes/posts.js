const express = require('express');
const Post = require('../models/post');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ created_at: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).send('Error fetching posts.');
    }
});

// Get a specific post by ID
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).send('Post not found');
        res.json(post);
    } catch (error) {
        res.status(500).send('Error fetching post.');
    }
});

// Create a new post (only authenticated users)
router.post('/', verifyToken, async (req, res) => {
    try {
        const newPost = new Post({
            title: req.body.title,
            content: req.body.content,
            author: req.userId,  // Assuming the authenticated user is the author
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(500).send('Error creating post.');
    }
});

// Update a post by ID (only authenticated users)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).send('Post not found');
        
        // Check if the post author is the same as the logged-in user
        if (post.author.toString() !== req.userId) {
            return res.status(403).send('You are not authorized to edit this post.');
        }

        post.title = req.body.title || post.title;
        post.content = req.body.content || post.content;

        const updatedPost = await post.save();
        res.json(updatedPost);
    } catch (error) {
        res.status(500).send('Error updating post.');
    }
});

// Delete a post by ID (only authenticated users)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).send('Post not found');
        
        // Check if the post author is the same as the logged-in user
        if (post.author.toString() !== req.userId) {
            return res.status(403).send('You are not authorized to delete this post.');
        }

        await post.remove();
        res.json({ message: 'Post deleted successfully.' });
    } catch (error) {
        res.status(500).send('Error deleting post.');
    }
});

module.exports = router;
