const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      unique: true,
      trim: true,
      maxlength: [50, 'Skill name cannot exceed 50 characters'],
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['WebDev', 'DSA', 'ML', 'Design', 'DevOps', 'Mobile'],
        message: '{VALUE} is not a valid category',
      },
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      maxlength: [200, 'Description cannot exceed 200 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// ─── INDEXES ───────────────────────────────────────────────
skillSchema.index({ category: 1 });


const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;