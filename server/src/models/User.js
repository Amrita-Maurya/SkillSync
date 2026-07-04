const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        'Please provide a valid email address',
      ],
    },

    college: {
      type: String,
      required: [true, 'College name is required'],
      trim: true,
      maxlength: [100, 'College name cannot exceed 100 characters'],
    },

    passwordHash: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    skillsKnown: [
      {
        skillId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Skill',
        },
        proficiency: {
          type: String,
          enum: ['Beginner', 'Intermediate', 'Advanced'],
          default: 'Beginner',
        },
      },
    ],

    skillsToLearn: [
      {
        skillId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Skill',
        },
        dailyTargetHours: {
          type: Number,
          min: [0.5, 'Daily target must be at least 0.5 hours'],
          max: [12, 'Daily target cannot exceed 12 hours'],
          default: 1,
        },
      },
    ],

    streaks: [
      {
        skillId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Skill',
        },
        count: {
          type: Number,
          default: 0,
        },
        lastLogDate: {
          type: Date,
          default: null,
        },
      },
    ],

    totalHoursPerSkill: {
      type: Map,
      of: Number,
      default: {},
    },

    onboardingComplete: {
      type: Boolean,
      default: false,
    },

    lastActiveDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// ─── INDEXES ───────────────────────────────────────────────
// Speeds up queries that filter or sort by these fields

userSchema.index({ lastActiveDate: -1 });

// ─── INSTANCE METHOD ───────────────────────────────────────
// Called as user.comparePassword(inputPassword) anywhere in the app
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

const User = mongoose.model('User', userSchema);

module.exports = User;