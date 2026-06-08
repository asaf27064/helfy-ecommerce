/**
 * Wraps an async Express route handler so that any rejected promise is
 * forwarded to the next() error-handling middleware instead of causing an
 * unhandled rejection.
 *
 * @param {Function} fn  Async (req, res, next) handler
 * @returns {Function}   Express-compatible route handler
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
