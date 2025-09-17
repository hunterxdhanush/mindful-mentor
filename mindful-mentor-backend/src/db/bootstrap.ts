import { pool } from './pool.js';
import { Pool } from 'pg';
import { env } from '../config/env.js';

const BOOTSTRAP_SQL = `
CREATE SCHEMA IF NOT EXISTS mindful;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS mindful.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mindful.journals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES mindful.users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  mood_tag TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS journals_user_id_idx
  ON mindful.journals (user_id, created_at DESC);
`;

export async function bootstrapDb() {
  // First, try to connect to the target DB. If it doesn't exist (3D000), create it.
  const url = new URL(env.DATABASE_URL);
  const targetDb = url.pathname.replace(/^\//, '');
  const host = url.hostname;
  const port = url.port || '5432';

  let client;
  try {
    client = await pool.connect();
  } catch (err: any) {
    if (err?.code === '3D000' || /does not exist/i.test(err?.message || '')) {
      // Connect to admin DB 'postgres' and create the target database
      const adminUrl = new URL(env.DATABASE_URL);
      adminUrl.pathname = '/postgres';
      const adminPool = new Pool({ connectionString: adminUrl.toString() });
      const admin = await adminPool.connect();
      try {
        await admin.query(`CREATE DATABASE ${JSON.stringify(targetDb).slice(1,-1)};`);
        console.log(`[backend] Created database '${targetDb}' on ${host}:${port}`);
      } catch (e: any) {
        if (!/already exists/i.test(e?.message || '')) {
          console.error('[backend] Failed creating database:', e?.message || e);
          throw e;
        }
      } finally {
        admin.release();
        await adminPool.end();
      }
      // retry connecting to target DB
      client = await pool.connect();
    } else {
      throw err;
    }
  }
  try {
    await client.query('BEGIN');
    await client.query(BOOTSTRAP_SQL);
    await client.query('COMMIT');
    console.log(`[backend] DB bootstrap complete (host=${host} port=${port} db=${targetDb})`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[backend] DB bootstrap failed:', (err as Error).message);
    throw err;
  } finally {
    client.release();
  }
}
