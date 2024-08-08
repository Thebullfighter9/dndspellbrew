const express = require('express');
const Spell = require('../models/spell');
const router = express.Router();

// Get all spells
router.get('/', (req, res) => {
    Spell.find().then(spells => {
        res.json(spells);
    }).catch(err => {
        res.status(500).send('Error fetching spells.');
    });
});

// Get a single spell
router.get('/:id', (req, res) => {
    Spell.findById(req.params.id).then(spell => {
        res.json(spell);
    }).catch(err => {
        res.status(500).send('Error fetching spell.');
    });
});

// Create a new spell
router.post('/', (req, res) => {
    const { name, description, level, school, damageType, class: spellClass, castingTime, range, components, duration, requiredLevel, variations, username } = req.body;
    const newSpell = new Spell({ name, description, level, school, damageType, class: spellClass, castingTime, range, components, duration, requiredLevel, variations, username });
    newSpell.save().then(spell => {
        res.json(spell);
    }).catch(err => {
        res.status(500).send('Error creating spell.');
    });
});

// Update an existing spell
router.put('/:id', (req, res) => {
    const { name, description, level, school, damageType, class: spellClass, castingTime, range, components, duration, requiredLevel, variations, username } = req.body;
    Spell.findByIdAndUpdate(req.params.id, { name, description, level, school, damageType, class: spellClass, castingTime, range, components, duration, requiredLevel, variations, username }, { new: true }).then(spell => {
        res.json(spell);
    }).catch(err => {
        res.status(500).send('Error updating spell.');
    });
});

module.exports = router;
