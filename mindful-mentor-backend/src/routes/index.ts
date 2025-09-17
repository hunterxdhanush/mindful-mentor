import { Router, Request, Response } from 'express';
import { pool, pingDb } from '../db/pool.js';
import { hfEmbed, hfSentiment } from '../services/huggingface.js';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.json({ ok: true, service: 'mindful-mentor-backend' });
});

router.get('/health/db', async (_req: Request, res: Response) => {
  try {
    const ok = await pingDb();
    // Also return db version and current time as a quick sanity check
    const info = await pool.query('SELECT version() as version, NOW() as now');
    res.json({ ok, version: info.rows[0]?.version, now: info.rows[0]?.now });
  } catch (err) {
    res.status(500).json({ ok: false, error: (err as Error).message });
  }
});

export default router;

// Embeddings: index a journal by ID
router.post('/embeddings/index', async (req: Request, res: Response) => {
  try {
    const { journalId } = req.body as { journalId?: string };
    if (!journalId) return res.status(400).json({ error: 'journalId is required' });

    const j = await pool.query(
      'SELECT id, user_id, title, content FROM mindful.journals WHERE id = $1',
      [journalId]
    );
    if (j.rowCount === 0) return res.status(404).json({ error: 'Journal not found' });

    const text = [j.rows[0].title ?? '', j.rows[0].content ?? ''].join('\n\n').trim();
    if (!text) return res.status(400).json({ error: 'Journal has no text to embed' });

    const vector = await hfEmbed(text);
    const vecLiteral = `[${vector.join(',')}]`;

    await pool.query(
      `INSERT INTO mindful.journal_embeddings (journal_id, embedding)
       VALUES ($1, $2::vector)
       ON CONFLICT (journal_id)
       DO UPDATE SET embedding = EXCLUDED.embedding, updated_at = NOW()`,
      [journalId, vecLiteral]
    );

    return res.json({ ok: true, journalId });
  } catch (err) {
    return res.status(500).json({ ok: false, error: (err as Error).message });
  }
});

// Semantic search over journals for a user
router.get('/search', async (req: Request, res: Response) => {
  try {
    const userId = String(req.query.userId || '');
    const q = String(req.query.q || '');
    const limit = Math.min(parseInt(String(req.query.limit || '10'), 10) || 10, 50);
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    if (!q) return res.status(400).json({ error: 'q is required' });

    const qVec = await hfEmbed(q);
    const vecLiteral = `[${qVec.join(',')}]`;

    const result = await pool.query(
      `SELECT j.id, j.title, j.created_at,
              1 - (je.embedding <=> $2::vector) AS score
       FROM mindful.journal_embeddings je
       JOIN mindful.journals j ON j.id = je.journal_id
       WHERE j.user_id = $1
       ORDER BY je.embedding <=> $2::vector ASC
       LIMIT $3`,
      [userId, vecLiteral, limit]
    );
    return res.json({ items: result.rows });
  } catch (err) {
    return res.status(500).json({ ok: false, error: (err as Error).message });
  }
});

// Sentiment classification
router.post('/sentiment', async (req: Request, res: Response) => {
  try {
    const { text } = req.body as { text?: string };
    if (!text) return res.status(400).json({ error: 'text is required' });
    const out = await hfSentiment(text);
    return res.json(out);
  } catch (err) {
    return res.status(500).json({ ok: false, error: (err as Error).message });
  }
});

// Create a user (minimal) to support frontend demo identity
router.post('/users', async (req: Request, res: Response) => {
  try {
    const { email, display_name } = req.body as { email?: string; display_name?: string };
    if (!email || !display_name) return res.status(400).json({ error: 'email and display_name are required' });
    const r = await pool.query(
      `INSERT INTO mindful.users (email, display_name)
       VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE SET display_name = EXCLUDED.display_name, updated_at = NOW()
       RETURNING id, email, display_name, created_at`,
      [email, display_name]
    );
    return res.status(201).json(r.rows[0]);
  } catch (err) {
    return res.status(500).json({ ok: false, error: (err as Error).message });
  }
});

// Create a journal entry
router.post('/journals', async (req: Request, res: Response) => {
  try {
    const { userId, title, content, moodTag } = req.body as {
      userId?: string; title?: string; content?: string; moodTag?: string;
    };
    if (!userId || !content) {
      return res.status(400).json({ error: 'userId and content are required' });
    }
    const r = await pool.query(
      `INSERT INTO mindful.journals (user_id, title, content, mood_tag)
       VALUES ($1, $2, $3, $4)
       RETURNING id, user_id, title, content, mood_tag, created_at`,
      [userId, title ?? null, content, moodTag ?? null]
    );
    const journal = r.rows[0];
    // Auto-embed the journal content (best-effort; non-fatal if it fails)
    let embedded = false;
    try {
      const text = [journal.title ?? '', journal.content ?? ''].join('\n\n').trim();
      if (text) {
        const vector = await hfEmbed(text);
        const vecLiteral = `[${vector.join(',')}]`;
        await pool.query(
          `INSERT INTO mindful.journal_embeddings (journal_id, embedding)
           VALUES ($1, $2::vector)
           ON CONFLICT (journal_id)
           DO UPDATE SET embedding = EXCLUDED.embedding, updated_at = NOW()`,
          [journal.id, vecLiteral]
        );
        embedded = true;
      }
    } catch {
      embedded = false;
    }
    return res.status(201).json({ ...journal, embedded });
  } catch (err) {
    return res.status(500).json({ ok: false, error: (err as Error).message });
  }
});

// List journals for a user
router.get('/journals', async (req: Request, res: Response) => {
  try {
    const userId = String(req.query.userId || '');
    const limit = Math.min(parseInt(String(req.query.limit || '50'), 10) || 50, 200);
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const r = await pool.query(
      `SELECT id, user_id, title, content, mood_tag, created_at
       FROM mindful.journals
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [userId, limit]
    );
    return res.json({ items: r.rows });
  } catch (err) {
    return res.status(500).json({ ok: false, error: (err as Error).message });
  }
});
