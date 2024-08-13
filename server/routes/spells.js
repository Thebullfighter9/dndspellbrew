const express = require('express');
const router = express.Router();
const Spell = require('../models/spell');
const verifyToken = require('../middleware/verifyToken');

// Create a new spell
router.post('/create', verifyToken, async (req, res) => {
    try {
        const newSpell = new Spell({
            name: req.body.name,
            description: req.body.description,
            level: req.body.level,
            school: req.body.school,
            damageType: req.body.damageType,
            class: req.body.class,
            castingTime: req.body.castingTime,
            range: req.body.range,
            components: req.body.components,
            duration: req.body.duration,
            requiredLevel: req.body.requiredLevel,
            variations: req.body.variations,
            username: req.userId // assuming you use the username from the authenticated user
        });

        await newSpell.save();
        res.status(201).json(newSpell);
    } catch (error) {
        res.status(500).send('Error creating spell.');
    }
});

// Get all spells
router.get('/', async (req, res) => {
    try {
        const spells = await Spell.find().sort({ created_at: -1 });
        res.json(spells);
    } catch (error) {
        res.status(500).send('Error fetching spells.');
    }
});

// Get a specific spell by ID
router.get('/:id', async (req, res) => {
    try {
        const spell = await Spell.findById(req.params.id);
        if (!spell) return res.status(404).send('Spell not found');
        res.json(spell);
    } catch (error) {
        res.status(500).send('Error fetching spell.');
    }
});

module.exports = router;
