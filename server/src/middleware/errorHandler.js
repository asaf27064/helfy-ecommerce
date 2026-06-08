import { ApiError } from '../utils/ApiError.js';
import logger from '../utils/logger.js';

/**
 * Central Express error-handling middleware.
 * All errors — whether thrown by services or passed via next(err) — are
 * formatted here into the standard { error: { message, code } } shape.
 */
// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      error: { message: err.message, code: err.code },
    });
  }

  // Zod validation errors arrive as plain objects with a .errors array
  if (err.name === 'ZodError') {
    const message = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
    return res.status(400).json({
      error: { message, code: 'VALIDATION_ERROR' },
    });
  }

  // Unexpected errors — log the full stack, return a generic 500
  logger.error('Unhandled error:', err);
  return res.status(500).json({
    error: { message: 'Internal server error', code: 'INTERNAL_ERROR' },
  });
}
