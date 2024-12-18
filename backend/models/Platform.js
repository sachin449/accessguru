import mongoose from 'mongoose';

const platformSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  credentials: { type: Object, required: true }, // API key or OAuth token
});

const Platform = mongoose.model('Platform', platformSchema);
export default Platform; // Use default export
