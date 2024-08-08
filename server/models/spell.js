const mongoose = require('mongoose');

const variationSchema = new mongoose.Schema({
    level: String,
    description: String
});

const spellSchema = new mongoose.Schema({
    name: String,
    description: String,
    level: { type: String, required: true },
    school: String,
    damageType: String,
    class: [String],
    castingTime: String,
    range: String,
    components: String,
    duration: String,
    requiredLevel: { type: String, required: true },
    variations: [variationSchema],
    username: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Spell', spellSchema);
