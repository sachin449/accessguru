const mongoose = require('mongoose');

const platformSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  credentials: { type: Object, required: true }, // API key or OAuth token
});

module.exports = mongoose.model('Platform', platformSchema);
