import jsonwebtoken from 'jsonwebtoken';
import env from '../config/env.js';
import { unauthorized } from './ApiError.js';

const { sign, verify } = jsonwebtoken;

/**
 * Sign a JWT with the application secret.
 * @param {{ id: number, email: string }} payload
 * @returns {string}
 */
export function signToken(payload) {
  const secret = env.jwt.secret;
  const expiry = env.jwt.expiry;
  return sign(payload, secret, { expiresIn: expiry });
}

/**
 * Verify a JWT and return its decoded payload.
 * Throws an ApiError(401) if the token is invalid or expired.
 * @param {string} token
 * @returns {{ id: number, email: string }}
 */
export function verifyToken(token) {
  try {
    const secret = env.jwt.secret;
    return verify(token, secret);
  } catch {
    throw unauthorized('Invalid or expired token');
  }
}
