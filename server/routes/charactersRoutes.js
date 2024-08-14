const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const Character = require('../models/character');

// Setup multer for file uploads
const upload = multer({
    dest: 'uploads/characters/'
});

// Route to submit a character
router.post('/submit-character', verifyToken, upload.single('characterSheet'), async (req, res) => {
    try {
        const { pdfState } = req.body;

        if (!pdfState) {
            return res.status(400).json({ success: false, message: 'Character sheet data is missing.' });
        }

        const newCharacter = new Character({
            userId: req.userId,
            pdfState: pdfState,
            filename: req.file ? req.file.filename : null
        });

        await newCharacter.save();
        res.status(200).json({ success: true, message: 'Character submitted successfully.' });

    } catch (error) {
        console.error('Error submitting character:', error.message);
        res.status(500).json({ success: false, message: 'Failed to submit character.' });
    }
});

// Route to get a character by ID
router.get('/character/:id', verifyToken, async (req, res) => {
    try {
        const character = await Character.findById(req.params.id);

        if (!character) {
            return res.status(404).json({ success: false, message: 'Character not found.' });
        }

        res.status(200).json({ success: true, character });

    } catch (error) {
        console.error('Error retrieving character:', error.message);
        res.status(500).json({ success: false, message: 'Failed to retrieve character.' });
    }
});

// Route to update a character
router.put('/character/:id', verifyToken, upload.single('characterSheet'), async (req, res) => {
    try {
        const character = await Character.findById(req.params.id);

        if (!character) {
            return res.status(404).json({ success: false, message: 'Character not found.' });
        }

        const { pdfState } = req.body;

        if (pdfState) {
            character.pdfState = pdfState;
        }

        if (req.file) {
            character.filename = req.file.filename;
        }

        await character.save();
        res.status(200).json({ success: true, message: 'Character updated successfully.' });

    } catch (error) {
        console.error('Error updating character:', error.message);
        res.status(500).json({ success: false, message: 'Failed to update character.' });
    }
});

// Route to delete a character
router.delete('/character/:id', verifyToken, async (req, res) => {
    try {
        const character = await Character.findById(req.params.id);

        if (!character) {
            return res.status(404).json({ success: false, message: 'Character not found.' });
        }

        await Character.findByIdAndRemove(req.params.id);

        if (character.filename) {
            fs.unlinkSync(path.join(__dirname, '../uploads/characters', character.filename));
        }

        res.status(200).json({ success: true, message: 'Character deleted successfully.' });

    } catch (error) {
        console.error('Error deleting character:', error.message);
        res.status(500).json({ success: false, message: 'Failed to delete character.' });
    }
});

module.exports = router;
