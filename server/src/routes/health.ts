import { Router } from 'express';
import { db } from '../config/db.js';
import { users } from '../db/schema.js';
import { firebaseAdminInitialized } from '../middleware/auth.js';
import { logger } from '../config/logger.js';

const router = Router();

router.get('/', async (req, res) => {
  const healthStatus: Record<string, any> = {
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptimeSeconds: process.uptime(),
    memoryUsage: process.memoryUsage(),
    services: {
      firebaseAdmin: firebaseAdminInitialized ? 'connected' : 'unconfigured_fallback',
      database: 'unknown'
    }
  };

  try {
    // Perform simple query to verify database connection health
    await db.select({ id: users.id }).from(users).limit(1);
    healthStatus.services.database = 'connected';
  } catch (error: any) {
    logger.error('Database health check failed:', error);
    healthStatus.status = 'DEGRADED';
    healthStatus.services.database = 'disconnected';
    healthStatus.error = error.message || 'Database connection error';
  }

  const statusCode = healthStatus.status === 'UP' ? 200 : 500;
  res.status(statusCode).json(healthStatus);
});

export default router;
