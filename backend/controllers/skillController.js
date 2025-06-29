import { Skill } from '../models/Skill.js';

export const createSkill = async (req, res) => {
  try {
    const { name, description, category, difficulty_level } = req.body;
    const skill = new Skill({ name, description, category, difficulty_level, created_by: req.userId });
    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Error creating skill', error: error.message });
  }
};

export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find();
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching skills', error: error.message });
  }
};
