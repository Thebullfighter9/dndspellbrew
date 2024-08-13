const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
    pdfState: String,
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Character', characterSchema);
