const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).send('Error registering new user.');
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).send('User not found');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).send('Invalid credentials');
        const token = jwt.sign({ id: user._id }, 'your_jwt_secret');
        res.json({ token });
    } catch (err) {
        res.status(500).send('Login error');
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('posts');
        if (!user) return res.status(404).send('User not found');

        res.json({
            user: {
                username: user.username,
                bio: user.bio,
                profilePicture: user.profilePicture
            },
            posts: user.posts,
            recentActivities: user.recentActivities
        });
    } catch (err) {
        res.status(500).send('Error fetching profile');
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
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
        await user.save();
        res.json({ user });
    } catch (err) {
        res.status(500).send('Error updating profile');
    }
};
