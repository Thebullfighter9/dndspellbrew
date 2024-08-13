const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const Character = require('../models/characters'); // Create a model to store character sheets

// Save character progress
router.post('/save', (req, res) => {
    const { code, pdfState } = req.body;

    const filePath = path.join(__dirname, `../../uploads/${code}.json`);
    fs.writeFile(filePath, JSON.stringify({ pdfState }), (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to save progress.' });
        }
        res.json({ success: true });
    });
});

// Submit character sheet
router.post('/submit', (req, res) => {
    const { pdfState } = req.body;

    const newCharacter = new Character({ pdfState });
    newCharacter.save()
        .then(() => res.json({ success: true }))
        .catch(() => res.status(500).json({ success: false, message: 'Failed to submit character.' }));
});

module.exports = router;
