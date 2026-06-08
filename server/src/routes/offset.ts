import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { offsetPurchaseSchema, SIMULATED_PROJECTS } from '@carbon/shared';
import { db } from '../config/db.js';
import { users, offsetPurchases } from '../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';
import { awardBadge } from '../utils/gamification.js';
import crypto from 'crypto';

const router = Router();

// Require authentication for all offset routes
router.use(requireAuth);

// GET /api/offsets - Get user offset purchase history
router.get('/', async (req, res) => {
  try {
    const userId = req.user!.uid;
    const purchases = await db.query.offsetPurchases.findMany({
      where: eq(offsetPurchases.userId, userId),
      orderBy: [desc(offsetPurchases.purchasedAt)]
    });

    res.json(purchases);
  } catch (error) {
    console.error('Error fetching offset purchases:', error);
    res.status(500).json({ error: 'Failed to fetch offset history' });
  }
});

// POST /api/offsets/purchase - Buy simulated offsets with Eco-Points
router.post('/purchase', async (req, res) => {
  try {
    const userId = req.user!.uid;

    const validationResult = offsetPurchaseSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.errors[0].message });
    }

    const { projectId, offsetAmountCo2eKg } = validationResult.data;

    // Find the project configuration
    const project = SIMULATED_PROJECTS.find(p => p.id === projectId);
    if (!project) {
      return res.status(400).json({ error: 'Invalid simulated project ID' });
    }

    // Calculate required points cost
    const requiredPoints = Math.round(offsetAmountCo2eKg * project.factor);

    // Fetch user profile to verify points balance
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });

    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    if (user.points < requiredPoints) {
      return res.status(400).json({ 
        error: `Insufficient Eco-Points. Required: ${requiredPoints}, Available: ${user.points}` 
      });
    }

    const purchaseId = crypto.randomUUID();

    // Perform purchase: update points and write purchase record
    await db.transaction(async (tx) => {
      // Deduct points from user
      await tx.update(users)
        .set({ points: user.points - requiredPoints })
        .where(eq(users.id, userId));

      // Record offset transaction
      await tx.insert(offsetPurchases).values({
        id: purchaseId,
        userId,
        projectId,
        offsetAmountCo2eKg,
        costSimulatedCurrency: requiredPoints,
      });
    });

    // Proactively award the Carbon Offset Champion badge
    const badgeAwarded = await awardBadge(userId, 'carbon_offset_champion');

    const updatedUser = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });

    res.status(201).json({
      message: `Successfully offset ${offsetAmountCo2eKg} kg of CO2e!`,
      purchase: {
        id: purchaseId,
        projectId,
        offsetAmountCo2eKg,
        costSimulatedCurrency: requiredPoints,
        purchasedAt: Math.floor(Date.now() / 1000)
      },
      user: updatedUser,
      badgeAwarded
    });

  } catch (error) {
    console.error('Error purchasing offsets:', error);
    res.status(500).json({ error: 'Failed to process offset purchase' });
  }
});

export default router;
