const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/dndspellbrew', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');
const spellRoutes = require('./routes/spells');

app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/spells', spellRoutes);

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/register.html'));
});

app.get('/profile.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/profile.html'));
});

app.get('/spells.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/spells.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
