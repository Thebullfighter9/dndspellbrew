const express = require('express');
const router = express.Router();
const { saveCharacter, getCharacter, updateCharacter } = require('../controllers/characterController');

// Route to save a new character
router.post('/submit-character', saveCharacter);

// Route to get a character by ID or code
router.get('/character/:id', getCharacter);

// Route to update an existing character
router.put('/character/:id', updateCharacter);

module.exports = router;
