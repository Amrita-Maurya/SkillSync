const ProgressLog = require('../models/ProgressLog');
const User = require('../models/User');
const { getTodayString, calculateStreak } = require('../utils/streakUtils');

// ─── LOG A SESSION ─────────────────────────────────────────
// POST /api/progress
// Protected — requires login and completed onboarding
const logSession = async (req, res) => {
  try {
    const { skillId, hoursSpent, topicsCovered } = req.body;
    const userId = req.user._id;
    const today = getTodayString();

    // Step 1: Verify the skill is in the user's learning list
    // Users can only log progress for skills they are learning
    const user = await User.findById(userId);
    const isLearning = user.skillsToLearn.some(
      (s) => s.skillId.toString() === skillId
    );

    if (!isLearning) {
      return res.status(400).json({
        success: false,
        message: 'You can only log progress for skills in your learning list.',
      });
    }

    // Step 2: Create the progress log
    // The unique index on {userId, skillId, date} will throw a duplicate
    // error if user tries to log the same skill twice on the same day
    let progressLog;
    try {
      progressLog = await ProgressLog.create({
        userId,
        skillId,
        date: today,
        hoursSpent,
        topicsCovered,
      });
    } catch (dupError) {
      // MongoDB duplicate key error code is 11000
      if (dupError.code === 11000) {
        return res.status(409).json({
          success: false,
          message: 'You have already logged a session for this skill today.',
        });
      }
      throw dupError;
    }

    // Step 3: Update streak for this skill
    // Find existing streak entry for this skill
    const existingStreakIndex = user.streaks.findIndex(
      (s) => s.skillId.toString() === skillId
    );

    const existingStreak =
      existingStreakIndex >= 0 ? user.streaks[existingStreakIndex] : null;

    const updatedStreak = calculateStreak(existingStreak, today);

    // Step 4: Update totalHoursPerSkill
    // Map.get returns undefined if key doesn't exist — default to 0
    const currentHours = user.totalHoursPerSkill.get(skillId) || 0;
    const newTotalHours = currentHours + hoursSpent;

    // Step 5: Check if user has hit the 20-hour graduation threshold
    const graduationPrompt = newTotalHours >= 20 && currentHours < 20;

    // Step 6: Build the streak update
    // If streak exists update it, if not push a new one
    let streakUpdate;
    if (existingStreakIndex >= 0) {
      streakUpdate = {
        $set: {
          [`streaks.${existingStreakIndex}.count`]: updatedStreak.count,
          [`streaks.${existingStreakIndex}.lastLogDate`]: updatedStreak.lastLogDate,
          [`totalHoursPerSkill.${skillId}`]: newTotalHours,
        },
      };
    } else {
      streakUpdate = {
        $push: {
          streaks: {
            skillId,
            count: updatedStreak.count,
            lastLogDate: updatedStreak.lastLogDate,
          },
        },
        $set: {
          [`totalHoursPerSkill.${skillId}`]: newTotalHours,
        },
      };
    }

    await User.findByIdAndUpdate(userId, streakUpdate);

    return res.status(201).json({
      success: true,
      message: 'Session logged successfully.',
      data: {
        log: progressLog,
        streak: updatedStreak,
        totalHoursForSkill: newTotalHours,
        graduationPrompt,
      },
    });
  } catch (error) {
    console.error('LogSession error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
    });
  }
};

// ─── GET PROGRESS LOGS ─────────────────────────────────────
// GET /api/progress?page=1&limit=10&skillId=optional
// Protected — returns paginated log history for the logged-in user
const getProgressLogs = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skillId = req.query.skillId;
    const skip = (page - 1) * limit;

    // Build query — filter by skill if provided
    const query = { userId };
    if (skillId) query.skillId = skillId;

    // Run count and find in parallel using Promise.all
    // Faster than running them sequentially
    const [logs, total] = await Promise.all([
      ProgressLog.find(query)
        .populate('skillId', 'name category slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ProgressLog.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        logs,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error('GetProgressLogs error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
    });
  }
};

module.exports = { logSession, getProgressLogs };