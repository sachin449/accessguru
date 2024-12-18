const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  platforms: [
    {
      platformName: { type: String, required: true },
      accountId: { type: String, required: true },
      status: { type: String, default: 'active' },
    },
  ],
});

module.exports = mongoose.model('Employee', employeeSchema);
