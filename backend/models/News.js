const mongoose = require('mongoose');

const newsSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String },
    date: { type: String, default: () => new Date().toLocaleDateString() },
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);
