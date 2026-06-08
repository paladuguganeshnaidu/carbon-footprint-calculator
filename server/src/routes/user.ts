import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { profileUpdateSchema } from '@carbon/shared';
import { db } from '../config/db.js';
import { users, footprintEntries, userChallenges, userAchievements, offsetPurchases, userGoals } from '../db/schema.js';
import { eq, and, desc, sql } from 'drizzle-orm';

const router = Router();

// Require authentication for all user/dashboard endpoints
router.use(requireAuth);

// Helper for JIT (Just-In-Time) user creation
async function getOrCreateUser(uid: string, email: string) {
  let user = await db.query.users.findFirst({
    where: eq(users.id, uid)
  });

  if (!user) {
    // Auto-create user inside SQLite using Firebase UID
    const displayName = email.split('@')[0];
    await db.insert(users).values({
      id: uid,
      email,
      displayName,
      points: 0,
      currentStreak: 0,
    }).onConflictDoNothing();

    user = await db.query.users.findFirst({
      where: eq(users.id, uid)
    });
  }
  return user!;
}

// GET /api/user/profile - Get user details
router.get('/profile', async (req, res) => {
  try {
    const userId = req.user!.uid;
    const email = req.user!.email;
    const user = await getOrCreateUser(userId, email);
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// PATCH /api/user/profile - Update displayName and avatarUrl
router.patch('/profile', async (req, res) => {
  try {
    const userId = req.user!.uid;
    const email = req.user!.email;
    const user = await getOrCreateUser(userId, email);

    const validationResult = profileUpdateSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.errors[0].message });
    }

    const { displayName, avatarUrl } = validationResult.data;

    await db.update(users)
      .set({
        displayName: displayName !== undefined ? displayName : user.displayName,
        avatarUrl: avatarUrl !== undefined ? avatarUrl : user.avatarUrl,
      })
      .where(eq(users.id, userId));

    const updatedUser = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// GET /api/user/challenges - Get active and completed eco-challenges
router.get('/challenges', async (req, res) => {
  try {
    const userId = req.user!.uid;
    const email = req.user!.email;
    await getOrCreateUser(userId, email);

    const challenges = await db.query.userChallenges.findMany({
      where: eq(userChallenges.userId, userId)
    });

    res.json(challenges);
  } catch (error) {
    console.error('Error fetching user challenges:', error);
    res.status(500).json({ error: 'Failed to fetch challenges' });
  }
});

// GET /api/user/achievements - Get awarded badges
router.get('/achievements', async (req, res) => {
  try {
    const userId = req.user!.uid;
    const email = req.user!.email;
    await getOrCreateUser(userId, email);

    const achievements = await db.query.userAchievements.findMany({
      where: eq(userAchievements.userId, userId)
    });

    res.json(achievements);
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

// GET /api/user/dashboard - Get aggregated KPI metrics, breakdowns, and history
router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.user!.uid;
    const email = req.user!.email;
    const user = await getOrCreateUser(userId, email);

    // 1. Get current month YYYY-MM
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthNum = now.getMonth() + 1;
    const currentMonthStr = `${currentYear}-${currentMonthNum.toString().padStart(2, '0')}`;

    // 2. Fetch footprint entries for the current month
    const entriesThisMonth = await db.query.footprintEntries.findMany({
      where: and(
        eq(footprintEntries.userId, userId),
        sql`strftime('%Y-%m', ${footprintEntries.entryDate}) = ${currentMonthStr}`
      )
    });

    const totalCarbonThisMonthKg = entriesThisMonth.reduce((acc, entry) => acc + entry.carbonCo2eKg, 0);

    // 3. Count completed challenges
    const completedChallengesList = await db.query.userChallenges.findMany({
      where: and(
        eq(userChallenges.userId, userId),
        eq(userChallenges.status, 'completed')
      )
    });

    // 4. Calculate category breakdown (All-time or this month, let's do all-time for robust analytics, or this month. All-time is better for general profiling)
    const allEntries = await db.query.footprintEntries.findMany({
      where: eq(footprintEntries.userId, userId)
    });

    const categorySums: Record<string, number> = { energy: 0, transport: 0, food: 0, waste: 0 };
    let allTimeTotal = 0;
    allEntries.forEach(entry => {
      if (entry.category in categorySums) {
        categorySums[entry.category] += entry.carbonCo2eKg;
        allTimeTotal += entry.carbonCo2eKg;
      }
    });

    const breakdown = Object.entries(categorySums).map(([category, value]) => ({
      category,
      value: parseFloat(value.toFixed(2)),
      percentage: allTimeTotal > 0 ? parseFloat(((value / allTimeTotal) * 100).toFixed(1)) : 0
    }));

    // 5. Calculate monthly historical trends (last 6 months)
    const monthlyHistory = [];
    for (let i = 5; i >= 0; i--) {
      const targetMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = targetMonth.getFullYear();
      const monthNum = targetMonth.getMonth() + 1;
      const monthKey = `${year}-${monthNum.toString().padStart(2, '0')}`;
      const monthLabel = targetMonth.toLocaleString('default', { month: 'short', year: '2-digit' });

      // Footprint total for this month
      const monthEntries = await db.query.footprintEntries.findMany({
        where: and(
          eq(footprintEntries.userId, userId),
          sql`strftime('%Y-%m', ${footprintEntries.entryDate}) = ${monthKey}`
        )
      });
      const carbonKg = monthEntries.reduce((sum, e) => sum + e.carbonCo2eKg, 0);

      // Offset total for this month
      const monthOffsets = await db.query.offsetPurchases.findMany({
        where: and(
          eq(offsetPurchases.userId, userId),
          sql`strftime('%Y-%m', datetime(${offsetPurchases.purchasedAt}, 'unixepoch')) = ${monthKey}`
        )
      });
      const offsetKg = monthOffsets.reduce((sum, o) => sum + o.offsetAmountCo2eKg, 0);

      monthlyHistory.push({
        month: monthLabel,
        carbonKg: parseFloat(carbonKg.toFixed(2)),
        offsetKg: parseFloat(offsetKg.toFixed(2)),
        targetKg: 400.0 // Paris Target (approx 4.8 tons per year per person)
      });
    }

    // 6. Fetch monthly goals for the current month
    const goalsList = await db.query.userGoals.findMany({
      where: and(
        eq(userGoals.userId, userId),
        eq(userGoals.targetMonth, currentMonthStr)
      )
    });

    res.json({
      user,
      kpis: {
        totalCarbonThisMonthKg: parseFloat(totalCarbonThisMonthKg.toFixed(2)),
        pointsEarned: user.points,
        activeStreak: user.currentStreak,
        challengesCompleted: completedChallengesList.length
      },
      breakdown,
      monthlyHistory,
      goals: goalsList
    });

  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

export default router;
