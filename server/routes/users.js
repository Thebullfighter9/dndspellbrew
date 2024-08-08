const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

// Middleware to verify token
function verifyToken(req, res, next) {
    const token = req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : null;
    if (!token) return res.status(403).send('No token provided.');

    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
        if (err) return res.status(500).send('Failed to authenticate token.');
        req.userId = decoded.id;
        next();
    });
}

router.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    bcrypt.hash(password, 10).then(hashedPassword => {
        const newUser = new User({ username, email, password: hashedPassword });
        newUser.save().then(user => {
            res.json(user);
        }).catch(err => {
            res.status(500).send('Error registering new user.');
        });
    });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }).then(user => {
        if (!user) return res.status(404).send('User not found');
        bcrypt.compare(password, user.password).then(isMatch => {
            if (!isMatch) return res.status(401).send('Invalid credentials');
            const token = jwt.sign({ id: user._id }, 'your_jwt_secret');
            res.json({ token });
        });
    });
});

router.get('/profile', verifyToken, (req, res) => {
    User.findById(req.userId).populate('posts').then(user => {
        if (!user) return res.status(404).send('User not found');

        const profileData = {
            user: {
                username: user.username,
                bio: user.bio,
                profilePicture: user.profilePicture
            },
            posts: user.posts,
            recentActivities: user.recentActivities
        };
        res.json(profileData);
    });
});

router.put('/profile', verifyToken, upload.single('profilePicture'), (req, res) => {
    User.findById(req.userId).then(user => {
        if (!user) return res.status(404).send('User not found');

        if (req.file) {
            const uploadsDir = path.join(__dirname, '../../public/uploads');
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
            }

            const targetPath = path.join(uploadsDir, `${user._id}-${req.file.originalname}`);
            fs.renameSync(req.file.path, targetPath);
            user.profilePicture = `/uploads/${user._id}-${req.file.originalname}`;
        }

        user.bio = req.body.bio;

        user.save().then(updatedUser => {
            res.json({ user: updatedUser });
        }).catch(err => {
            res.status(500).send('Error updating profile.');
        });
    });
});

module.exports = router;
