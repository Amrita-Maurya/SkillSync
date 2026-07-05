const mongoose = require('mongoose');

const progressLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },

    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      required: [true, 'Skill ID is required'],
    },

    // We store the date as a pure date string (YYYY-MM-DD)
    // NOT a full timestamp — this avoids all timezone comparison issues
    // "2026-07-04" is the same regardless of where the user is
    date: {
      type: String,
      required: [true, 'Date is required'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
    },

    hoursSpent: {
      type: Number,
      required: [true, 'Hours spent is required'],
      min: [0.5, 'Minimum session is 0.5 hours'],
      max: [12, 'Maximum session is 12 hours'],
    },

    topicsCovered: {
      type: String,
      required: [true, 'Topics covered is required'],
      trim: true,
      minlength: [20, 'Please describe topics in at least 20 characters'],
      maxlength: [500, 'Topics covered cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// ─── INDEXES ───────────────────────────────────────────────

// Prevents duplicate logs for same user + skill + date
// This is enforced at the database level, not just application level
progressLogSchema.index(
  { userId: 1, skillId: 1, date: 1 },
  { unique: true }
);

// For group feed queries — get all logs for a skill sorted by date
progressLogSchema.index({ skillId: 1, createdAt: -1 });

// For user profile log history
progressLogSchema.index({ userId: 1, createdAt: -1 });

const ProgressLog = mongoose.model('ProgressLog', progressLogSchema);

module.exports = ProgressLog;