
const mongoose = require('mongoose');

const PasteSchema = new mongoose.Schema({
  content: { type: String, required: true },
  views: { type: Number, default: 0 },
  maxViews: { type: Number, default: null },
  expiresAt: { type: Date, default: null }
});

module.exports = mongoose.model('Paste', PasteSchema);
