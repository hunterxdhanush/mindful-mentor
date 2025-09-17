import app from './app.js';
import { env } from './config/env.js';
import { bootstrapDb } from './db/bootstrap.js';

const PORT = env.PORT;

(async () => {
  try {
    await bootstrapDb();
  } catch (err) {
    console.error('[backend] Fatal: DB bootstrap failed. Exiting.', (err as Error).message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`[backend] Server listening on http://localhost:${PORT}`);
  });
})();
