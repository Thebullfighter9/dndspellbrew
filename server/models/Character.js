const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
    pdfState: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Character', CharacterSchema);
