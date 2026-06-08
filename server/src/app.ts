import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { initFirebase } from './middleware/auth.js';
import { logger } from './config/logger.js';
import footprintRouter from './routes/footprint.js';
import userRouter from './routes/user.js';
import offsetRouter from './routes/offset.js';
import healthRouter from './routes/health.js';
import goalsRouter from './routes/goals.js';

import { calculationRequestSchema } from '@carbon/shared';
import { calculateCarbon } from './utils/calculator.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Resolve directory paths for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin SDK
initFirebase();

// Gzip asset compression
app.use(compression());

// Structured JSON request logger middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`, {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration,
      ip: req.ip
    });
  });
  next();
});

// Security Headers Setup with custom Content Security Policy (CSP)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://apis.google.com", "https://www.gstatic.com", "https://*.firebaseapp.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://www.gstatic.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://*.googleusercontent.com"],
      connectSrc: ["'self'", "https://*.googleapis.com", "https://securetoken.googleapis.com", "https://*.firebaseapp.com"],
      frameSrc: ["'self'", "https://*.firebaseapp.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    }
  }
}));

// CORS Configuration
const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (origin === allowedOrigin || allowedOrigin === '*') {
      return callback(null, true);
    }
    return callback(new Error('CORS Policy: Origin not allowed.'));
  },
  credentials: true
}));

// JSON Parser middleware
app.use(express.json());

// API Rate Limiting to prevent denial of service attacks
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', apiLimiter);

// API Routes
app.use('/api/health', healthRouter);
app.use('/api/footprint', footprintRouter);
app.use('/api/user', userRouter);
app.use('/api/offsets', offsetRouter);
app.use('/api/user/goals', goalsRouter);

// Raw carbon footprint calculation preview route (No Auth needed)
app.post('/api/calculate', (req, res) => {
  const result = calculationRequestSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors[0].message });
  }
  const { category, subCategory, value } = result.data;
  try {
    const calc = calculateCarbon(category, subCategory, value);
    res.json(calc);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Calculation failed' });
  }
});

// Serve compiled client build statically in Production mode
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientBuildPath));

  // Catch-all route to serve Index.html for SPA frontend routing
  app.get('*', (req, res, next) => {
    // Exclude API routes from falling back to client SPA
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
} else {
  // Test/Development status route
  app.get('/', (req, res) => {
    res.json({ status: 'running', env: process.env.NODE_ENV || 'development' });
  });
}

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled Server Error', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Only start the listener if app.ts is run directly (useful for Supertest mocks)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`Carbon Footprint Tracker server running on port ${PORT}`);
  });
}

export default app;
