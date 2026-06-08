import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../db/schema.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default database path if not provided in environment variables
const dbPath = process.env.DATABASE_URL 
  ? process.env.DATABASE_URL.replace('file:', '') 
  : path.join(__dirname, '../../app.db');

const sqlite = new Database(dbPath);

// Enable WAL (Write-Ahead Logging) mode to handle concurrent operations safely in SQLite
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite, { schema });
