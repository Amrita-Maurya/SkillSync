import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: String,
  difficulty_level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export const Skill = mongoose.model('Skill', SkillSchema);
