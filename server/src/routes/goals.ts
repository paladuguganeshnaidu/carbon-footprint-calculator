import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { userGoalSchema } from '@carbon/shared';
import { db } from '../config/db.js';
import { userGoals } from '../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';
import crypto from 'crypto';

const router = Router();

// Require auth for all goal endpoints
router.use(requireAuth);

// GET /api/user/goals - Get all user reduction goals
router.get('/', async (req, res) => {
  try {
    const userId = req.user!.uid;
    const goals = await db.query.userGoals.findMany({
      where: eq(userGoals.userId, userId),
      orderBy: [desc(userGoals.targetMonth), desc(userGoals.createdAt)]
    });

    res.json(goals);
  } catch (error) {
    console.error('Error fetching user goals:', error);
    res.status(500).json({ error: 'Failed to fetch user goals' });
  }
});

// GET /api/user/goals/:month - Get user goals for a specific month (YYYY-MM)
router.get('/:month', async (req, res) => {
  try {
    const userId = req.user!.uid;
    const month = req.params.month;
    
    const goals = await db.query.userGoals.findMany({
      where: and(
        eq(userGoals.userId, userId),
        eq(userGoals.targetMonth, month)
      )
    });

    res.json(goals);
  } catch (error) {
    console.error('Error fetching user monthly goals:', error);
    res.status(500).json({ error: 'Failed to fetch user monthly goals' });
  }
});

// POST /api/user/goals - Set or update a carbon reduction goal
router.post('/', async (req, res) => {
  try {
    const userId = req.user!.uid;

    const validationResult = userGoalSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.errors[0].message });
    }

    const { category, targetValue, targetMonth } = validationResult.data;

    // Check if a goal already exists for this category and month
    const existingGoal = await db.query.userGoals.findFirst({
      where: and(
        eq(userGoals.userId, userId),
        eq(userGoals.category, category),
        eq(userGoals.targetMonth, targetMonth)
      )
    });

    if (existingGoal) {
      // Update existing goal target
      await db.update(userGoals)
        .set({ targetValue })
        .where(eq(userGoals.id, existingGoal.id));

      const updated = await db.query.userGoals.findFirst({
        where: eq(userGoals.id, existingGoal.id)
      });

      return res.json({ message: 'Goal updated successfully', goal: updated });
    }

    // Insert new goal
    const goalId = crypto.randomUUID();
    await db.insert(userGoals).values({
      id: goalId,
      userId,
      category,
      targetValue,
      targetMonth,
    });

    const newGoal = await db.query.userGoals.findFirst({
      where: eq(userGoals.id, goalId)
    });

    res.status(201).json({ message: 'Goal created successfully', goal: newGoal });
  } catch (error) {
    console.error('Error saving user goal:', error);
    res.status(500).json({ error: 'Failed to save user goal' });
  }
});

export default router;
