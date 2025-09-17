-- Enable pgvector extension and create embeddings table.
-- Run this in pgAdmin Query Tool against your database.

CREATE EXTENSION IF NOT EXISTS vector;
CREATE SCHEMA IF NOT EXISTS mindful;

-- Adjust the dimension (384) if you use a different embeddings model.
CREATE TABLE IF NOT EXISTS mindful.journal_embeddings (
  journal_id UUID PRIMARY KEY REFERENCES mindful.journals(id) ON DELETE CASCADE,
  embedding  vector(384) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- For user-scoped search performance
CREATE INDEX IF NOT EXISTS journal_embeddings_journal_id_idx
  ON mindful.journal_embeddings (journal_id);

-- Optional: ivfflat index for faster search (requires ANALYZE; choose lists based on data size)
-- CREATE INDEX IF NOT EXISTS journal_embeddings_embedding_idx
--   ON mindful.journal_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
