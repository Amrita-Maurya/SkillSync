import express from 'express';
import { createSkill, getSkills } from '../controllers/skillController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createSkill);
router.get('/', getSkills);

export default router;
