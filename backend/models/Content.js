const mongoose = require('mongoose');

const contentSchema = mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Content', contentSchema);
