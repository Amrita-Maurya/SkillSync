const User = require('../models/User');
const Skill = require('../models/Skill');

// ─── UPDATE PROFILE ────────────────────────────────────────
// PUT /api/users/profile
// Protected — requires login
// Used during onboarding and profile edits
const updateProfile = async (req, res) => {
  try {
    const { skillsKnown, skillsToLearn } = req.body;

    // Validate that skillIds actually exist in the Skill collection
    // Prevents storing references to non-existent skills
    if (skillsKnown && skillsKnown.length > 0) {
      const knownIds = skillsKnown.map((s) => s.skillId);
      const foundSkills = await Skill.find({ _id: { $in: knownIds } });
      if (foundSkills.length !== knownIds.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more skills in skillsKnown are invalid.',
        });
      }
    }

    if (skillsToLearn && skillsToLearn.length > 0) {
      const learnIds = skillsToLearn.map((s) => s.skillId);
      const foundSkills = await Skill.find({ _id: { $in: learnIds } });
      if (foundSkills.length !== learnIds.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more skills in skillsToLearn are invalid.',
        });
      }

      // A skill cannot be in both lists simultaneously
      if (skillsKnown && skillsKnown.length > 0) {
        const knownIds = skillsKnown.map((s) => s.skillId.toString());
        const conflict = learnIds.find((id) => knownIds.includes(id.toString()));
        if (conflict) {
          return res.status(400).json({
            success: false,
            message: 'A skill cannot be in both skillsKnown and skillsToLearn.',
          });
        }
      }
    }

    // Build the update object dynamically
    // Only update fields that were actually sent in the request
    const updateFields = {};
    if (skillsKnown !== undefined) updateFields.skillsKnown = skillsKnown;
    if (skillsToLearn !== undefined) updateFields.skillsToLearn = skillsToLearn;

    // Mark onboarding complete if user has at least one learning skill
    if (skillsToLearn && skillsToLearn.length > 0) {
      updateFields.onboardingComplete = true;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true, runValidators: true }
    )
      .populate('skillsKnown.skillId', 'name category slug')
      .populate('skillsToLearn.skillId', 'name category slug');

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: { user },
    });
  } catch (error) {
    console.error('UpdateProfile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
    });
  }
};

// ─── GET CURRENT USER ──────────────────────────────────────
// GET /api/users/me
// Protected — returns full user profile with populated skills
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('skillsKnown.skillId', 'name category slug')
      .populate('skillsToLearn.skillId', 'name category slug');

    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error('GetMe error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
    });
  }
};

module.exports = { updateProfile, getMe };