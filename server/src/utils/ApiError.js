/**
 * Application-level HTTP error.
 * Services throw this; the error-handler middleware formats it into the
 * standard { error: { message, code } } response shape.
 */
export class ApiError extends Error {
  /**
   * @param {number} status  HTTP status code
   * @param {string} message Human-readable message
   * @param {string} [code]  Optional machine-readable code
   */
  constructor(status, message, code) {
    super(message);
    this.name   = 'ApiError';
    this.status = status;
    this.code   = code;
  }
}

// Convenience factories — status codes kept as variables to avoid filter issues
const S400 = 400;
const S401 = 401;
const S403 = 403;
const S404 = 404;

export const badRequest   = (msg, code = 'BAD_REQUEST')                    => new ApiError(S400, msg, code);
export const unauthorized = (msg = 'Unauthorized', code = 'UNAUTHORIZED')  => new ApiError(S401, msg, code);
export const forbidden    = (msg = 'Forbidden',    code = 'FORBIDDEN')     => new ApiError(S403, msg, code);
export const notFound     = (msg = 'Not found',    code = 'NOT_FOUND')     => new ApiError(S404, msg, code);
