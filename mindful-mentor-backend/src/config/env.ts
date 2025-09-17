import { config as loadEnv } from 'dotenv';
import { z } from 'zod';

// Load .env before reading process.env
loadEnv();

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  CORS_ORIGIN: z.string().optional(),
  DATABASE_URL: z.string().url().min(1, 'DATABASE_URL is required'),
  // Provider: Hugging Face (preferred per user)
  HUGGINGFACE_API_KEY: z.string().min(1, 'HUGGINGFACE_API_KEY is required'),
  HF_EMBEDDING_MODEL: z.string().default('sentence-transformers/all-MiniLM-L6-v2'),
  HF_SENTIMENT_MODEL: z.string().default('distilbert-base-uncased-finetuned-sst-2-english'),
  // Optional: OpenAI (kept for future flexibility)
  OPENAI_API_KEY: z.string().optional(),
  EMBEDDING_MODEL: z.string().optional(),
  SENTIMENT_MODEL: z.string().optional(),
});

export const env = EnvSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  DATABASE_URL: process.env.DATABASE_URL,
  HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY,
  HF_EMBEDDING_MODEL: process.env.HF_EMBEDDING_MODEL,
  HF_SENTIMENT_MODEL: process.env.HF_SENTIMENT_MODEL,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  EMBEDDING_MODEL: process.env.EMBEDDING_MODEL,
  SENTIMENT_MODEL: process.env.SENTIMENT_MODEL,
});
