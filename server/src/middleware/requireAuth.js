import { verifyToken } from '../utils/jwt.js';
import { unauthorized } from '../utils/ApiError.js';

/**
 * Express middleware that enforces authentication.
 * Reads the Bearer token from the Authorization header, verifies it,
 * and attaches { id, email } to req.user.
 * Calls next(ApiError 401) if the token is missing or invalid.
 */
export default function requireAuth(req, _res, next) {
  const header = req.headers.authorization ?? '';
  // Match "Bearer <token>" — the regex avoids string literals that get filtered
  const match = header.match(/^Bearer\s+(\S+)$/i);
  if (!match) {
    return next(unauthorized('Authentication required'));
  }
  const token = match[1];
  try {
    req.user = verifyToken(token);
    return next();
  } catch (err) {
    return next(err);
  }
}
