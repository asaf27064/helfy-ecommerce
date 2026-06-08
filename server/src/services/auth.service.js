import { findByEmail, findById, createUser } from '../db/userRepo.js';
import { encryptPassword, verifyPassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import { ApiError, unauthorized, notFound } from '../utils/ApiError.js';

// Strips the password hash before a user object leaves the service layer.
function publicUser(u) {
  return {
    id:        u.id,
    email:     u.email,
    firstName: u.firstName,
    lastName:  u.lastName,
    createdAt: u.createdAt,
  };
}

export async function register({ email, password, firstName, lastName }) {
  const existing = await findByEmail(email);
  if (existing) throw new ApiError(409, 'Email already registered', 'EMAIL_TAKEN');

  const passwordHash = await encryptPassword(password);
  const user = await createUser({
    email,
    passwordHash,
    firstName: firstName ?? '',
    lastName:  lastName ?? '',
  });

  const pub = publicUser(user);
  const token = signToken({ id: pub.id, email: pub.email });
  return { user: pub, token };
}

export async function login({ email, password }) {
  const user = await findByEmail(email);
  if (!user) throw unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) throw unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');

  const pub = publicUser(user);
  const token = signToken({ id: pub.id, email: pub.email });
  return { user: pub, token };
}

export async function getMe(userId) {
  const user = await findById(userId);
  if (!user) throw notFound('User not found', 'USER_NOT_FOUND');
  return publicUser(user);
}
