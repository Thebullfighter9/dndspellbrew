const Spell = require('../models/Spell');

exports.createSpell = async (req, res) => {
    try {
        const { name, description, level, school, castingTime, range, components, duration } = req.body;
        const newSpell = new Spell({
            name,
            description,
            level,
            school,
            castingTime,
            range,
            components,
            duration
        });
        await newSpell.save();
        res.status(201).json(newSpell);
    } catch (err) {
        res.status(500).send('Error creating spell.');
    }
};

exports.getSpells = async (req, res) => {
    try {
        const spells = await Spell.find();
        res.json(spells);
    } catch (err) {
        res.status(500).send('Error fetching spells.');
    }
};

exports.getSpellById = async (req, res) => {
    try {
        const spell = await Spell.findById(req.params.id);
        if (!spell) return res.status(404).send('Spell not found');
        res.json(spell);
    } catch (err) {
        res.status(500).send('Error fetching spell.');
    }
};
