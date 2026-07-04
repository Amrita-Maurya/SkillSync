const express = require('express');
const router = express.Router();
const { getAllSkills, getSkillBySlug } = require('../controllers/skillController');

// GET /api/skills
router.get('/', getAllSkills);

// GET /api/skills/:slug
router.get('/:slug', getSkillBySlug);

module.exports = router;