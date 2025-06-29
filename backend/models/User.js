import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  college_id: { type: String, required: true, unique: true },
  skills_known: [String],
  skills_learning: [String],
  accountability_type: { type: String, enum: ['self', 'group'], default: 'self' },
  created_at: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', UserSchema);
