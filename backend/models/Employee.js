import mongoose from 'mongoose';

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

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee; // Use default export
