import { config as loadEnv } from 'dotenv';
import { z } from 'zod';

// Load .env before reading process.env
loadEnv();

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  CORS_ORIGIN: z.string().optional(),
});

export const env = EnvSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
});
