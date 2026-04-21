import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';

let instance: Database.Database | null = null;

function resolveDbPath(): string {
  const env = process.env.FORMO_DB_PATH;
  if (env && env.trim()) return env.trim();
  return path.join(process.cwd(), 'data', 'formo.db');
}

export function getDb(): Database.Database {
  if (instance) return instance;
  const dbPath = resolveDbPath();
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.exec(`
    CREATE TABLE IF NOT EXISTS published_boards (
      slug TEXT PRIMARY KEY,
      board_json TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_published_created ON published_boards (created_at DESC);
  `);
  instance = db;
  return db;
}
