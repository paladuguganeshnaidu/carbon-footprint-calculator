import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(), // Firebase UID
  email: text('email').notNull().unique(),
  displayName: text('display_name'),
  avatarUrl: text('avatar_url'),
  createdAt: integer('created_at').notNull().default(sql`(strftime('%s', 'now'))`),
  points: integer('points').notNull().default(0),
  currentStreak: integer('current_streak').notNull().default(0),
  lastActiveDate: text('last_active_date'), // YYYY-MM-DD
});

export const footprintEntries = sqliteTable('footprint_entries', {
  id: text('id').primaryKey(), // UUID
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  entryDate: text('entry_date').notNull(), // YYYY-MM-DD
  category: text('category').notNull(), // 'energy', 'transport', 'food', 'waste'
  inputValue: real('input_value').notNull(),
  inputUnit: text('input_unit').notNull(),
  carbonCo2eKg: real('carbon_co2e_kg').notNull(),
  metadata: text('metadata').notNull(), // JSON string for details
  createdAt: integer('created_at').notNull().default(sql`(strftime('%s', 'now'))`),
});

export const userChallenges = sqliteTable('user_challenges', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  challengeId: text('challenge_id').notNull(), // e.g., 'meatless_week'
  status: text('status').notNull().default('active'), // 'active', 'completed', 'failed'
  progress: real('progress').notNull().default(0.0),
  startedAt: integer('started_at').notNull().default(sql`(strftime('%s', 'now'))`),
  completedAt: integer('completed_at'), // timestamp
});

export const userAchievements = sqliteTable('user_achievements', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  badgeId: text('badge_id').notNull(), // 'first_calculation', etc.
  awardedAt: integer('awarded_at').notNull().default(sql`(strftime('%s', 'now'))`),
});

export const offsetPurchases = sqliteTable('offset_purchases', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  projectId: text('project_id').notNull(),
  offsetAmountCo2eKg: real('offset_amount_co2e_kg').notNull(),
  costSimulatedCurrency: real('cost_simulated_currency').notNull(),
  purchasedAt: integer('purchased_at').notNull().default(sql`(strftime('%s', 'now'))`),
});
export type DBUser = typeof users.$inferSelect;
export type DBFootprintEntry = typeof footprintEntries.$inferSelect;
export type DBUserChallenge = typeof userChallenges.$inferSelect;
export type DBUserAchievement = typeof userAchievements.$inferSelect;
export type DBOffsetPurchase = typeof offsetPurchases.$inferSelect;
