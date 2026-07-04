const Skill = require('../models/Skill');

// ─── GET ALL SKILLS ────────────────────────────────────────
// GET /api/skills
// Public route — used in onboarding and skill selector dropdowns
// Returns skills grouped by category for easy frontend rendering
const getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ category: 1, name: 1 });

    // Group skills by category
    // Reduces frontend work — no need to group in React
    const grouped = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push({
        _id: skill._id,
        name: skill.name,
        slug: skill.slug,
        description: skill.description,
        category: skill.category,
      });
      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      data: {
        skills,        // flat array — useful for search/filter
        grouped,       // grouped by category — useful for onboarding UI
        total: skills.length,
      },
    });
  } catch (error) {
    console.error('GetAllSkills error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
    });
  }
};

// ─── GET SINGLE SKILL ──────────────────────────────────────
// GET /api/skills/:slug
// Public route — used for group pages
const getSkillBySlug = async (req, res) => {
  try {
    const skill = await Skill.findOne({ slug: req.params.slug });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: { skill },
    });
  } catch (error) {
    console.error('GetSkillBySlug error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
    });
  }
};

module.exports = { getAllSkills, getSkillBySlug };