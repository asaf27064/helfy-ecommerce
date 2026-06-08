import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import mysql from 'mysql2/promise';
import env from './config/env.js';
import logger from './utils/logger.js';
import errorHandler from './middleware/errorHandler.js';
import { notFound } from './utils/ApiError.js';

import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';
import profileRoutes from './routes/profile.routes.js';

// ── DB connection with retry ─────────────────────────────────────────────────
// The server waits for MySQL to be ready (up to 30 s) before binding the port,
// so no external wait-for-it script is needed (Prime Directive: zero-touch).
async function waitForDb(maxAttempts = 60, intervalMs = 2000) {
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
      logger.info('database reachable');
      return;
    } catch {
      logger.info(`waiting for db… attempt ${attempt}/${maxAttempts}`);
      await new Promise((r) => setTimeout(r, intervalMs));
    }
  }
  logger.error('could not connect to database after max attempts — exiting');
  process.exit(1);
}

async function start() {
  await waitForDb();

  const app = express();
  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(cors({ origin: env.corsOrigin, credentials: true }));
  app.use(express.json());
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

  // Health check — used by docker compose and the nginx upstream
  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

  // Feature routers
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/profile', profileRoutes);

  // Unmatched API routes -> standard 404 via the error handler
  app.use('/api', (_req, _res, next) => next(notFound('Route not found', 'NOT_FOUND')));

  // Central error handler (must be last)
  app.use(errorHandler);

  const server = app.listen(env.port, () =>
    logger.info(`listening on port ${env.port} (${env.nodeEnv})`)
  );

  // ── Graceful shutdown ──────────────────────────────────────────────────────
  const shutdown = (signal) => {
    logger.info(`${signal} received — shutting down gracefully`);
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

start();
