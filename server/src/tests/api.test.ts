import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { db } from '../config/db.js';
import { users, footprintEntries } from '../db/schema.js';
import { eq } from 'drizzle-orm';

describe('Express API Endpoints', () => {
  const devHeaders = {
    'x-dev-user-id': 'test-user-999',
    'x-dev-user-email': 'test-user@example.com'
  };

  it('GET / should return development status', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('running');
  });

  it('POST /api/calculate should return calculation without auth', async () => {
    const res = await request(app)
      .post('/api/calculate')
      .send({
        category: 'energy',
        subCategory: 'electricity',
        value: 100
      });
    expect(res.status).toBe(200);
    expect(res.body.carbonCo2eKg).toBe(38);
  });

  it('POST /api/footprint should log entry and trigger streak/points', async () => {
    // Clean test-user data if any existed previously
    try {
      await db.delete(footprintEntries).where(eq(footprintEntries.userId, 'test-user-999'));
      await db.delete(users).where(eq(users.id, 'test-user-999'));
    } catch (e) {
      // Tables might not exist yet if db:push hasn't run, tests will fail gracefully later or run after push
    }

    const res = await request(app)
      .post('/api/footprint')
      .set(devHeaders)
      .send({
        entryDate: '2026-06-08',
        category: 'food',
        inputValue: 2,
        inputUnit: 'kg',
        subCategory: 'vegan',
        notes: 'Delicious vegan pasta'
      });

    expect(res.status).toBe(201);
    expect(res.body.entry.carbonCo2eKg).toBe(3.0); // 2 * 1.5
    expect(res.body.gamification.pointsAwarded).toBeGreaterThan(0);
  });

  it('GET /api/footprint should retrieve logged entries', async () => {
    const res = await request(app)
      .get('/api/footprint')
      .set(devHeaders);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /api/user/dashboard should return dashboard KPIs and trend data', async () => {
    const res = await request(app)
      .get('/api/user/dashboard')
      .set(devHeaders);

    expect(res.status).toBe(200);
    expect(res.body.kpis.pointsEarned).toBeGreaterThan(0);
    expect(Array.isArray(res.body.breakdown)).toBe(true);
    expect(Array.isArray(res.body.monthlyHistory)).toBe(true);
  });

  it('POST /api/offsets/purchase should fail if points are insufficient', async () => {
    const res = await request(app)
      .post('/api/offsets/purchase')
      .set(devHeaders)
      .send({
        projectId: 'amazon_reforestation',
        offsetAmountCo2eKg: 50000 // requires 5,000,000 points!
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Insufficient Eco-Points');
  });
});
