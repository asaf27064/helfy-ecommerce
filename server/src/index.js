import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import mysql from 'mysql2/promise';
import env from './config/env.js';

// ── DB connection with retry ─────────────────────────────────────────────────
// The server waits for MySQL to be ready (up to 30 s) before binding the port.
// This removes the need for any external wait-for-it script.

async function waitForDb(maxAttempts = 30, intervalMs = 1000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const conn = await mysql.createConnection({
        host:     env.db.host,
        port:     env.db.port,
        user:     env.db.user,
        password: env.db.password,
        database: env.db.name,
      });
      await conn.ping();
      await conn.end();
      console.log('[server] database reachable');
      return;
    } catch {
      console.log(`[server] waiting for db… attempt ${attempt}/${maxAttempts}`);
      await new Promise((r) => setTimeout(r, intervalMs));
    }
  }
  console.error('[server] could not connect to database after max attempts — exiting');
  process.exit(1);
}

// ── App bootstrap ────────────────────────────────────────────────────────────

async function start() {
  await waitForDb();

  const app = express();

  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(cors({ origin: env.corsOrigin, credentials: true }));
  app.use(express.json());
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

  // Health check — used by docker compose and the nginx upstream
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // 404 catch-all for unmatched API routes
  app.use('/api', (_req, res) => {
    res.status(404).json({ error: { message: 'Not found', code: 'NOT_FOUND' } });
  });

  const server = app.listen(env.port, () => {
    console.log(`[server] listening on port ${env.port} (${env.nodeEnv})`);
  });

  // ── Graceful shutdown ──────────────────────────────────────────────────────
  const shutdown = (signal) => {
    console.log(`[server] ${signal} received — shutting down gracefully`);
    server.close(() => {
      console.log('[server] HTTP server closed');
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
}

start();
