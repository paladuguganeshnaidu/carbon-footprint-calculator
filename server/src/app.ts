import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { initFirebase } from './middleware/auth.js';
import footprintRouter from './routes/footprint.js';
import userRouter from './routes/user.js';
import offsetRouter from './routes/offset.js';

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

// Security Headers Setup
app.use(helmet({
  contentSecurityPolicy: false
}));

// CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
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
app.use('/api/footprint', footprintRouter);
app.use('/api/user', userRouter);
app.use('/api/offsets', offsetRouter);

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
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Only start the listener if app.ts is run directly (useful for Supertest mocks)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Carbon Footprint Tracker server running on port ${PORT}`);
  });
}

export default app;
