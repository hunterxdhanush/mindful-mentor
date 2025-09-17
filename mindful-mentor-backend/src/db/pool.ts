import { Pool } from 'pg';
import { env } from '../config/env.js';

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  // Optional SSL for cloud providers (uncomment if needed)
  // ssl: { rejectUnauthorized: false },
});

export async function pingDb() {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT 1 AS ok');
    return res.rows[0]?.ok === 1;
  } finally {
    client.release();
  }
}
