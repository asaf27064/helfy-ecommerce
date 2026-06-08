import { findById, updateUser } from '../db/userRepo.js';
import { notFound } from '../utils/ApiError.js';

function publicUser(u) {
  return {
    id:        u.id,
    email:     u.email,
    firstName: u.firstName,
    lastName:  u.lastName,
    createdAt: u.createdAt,
  };
}

export async function getProfile(userId) {
  const user = await findById(userId);
  if (!user) throw notFound('User not found', 'USER_NOT_FOUND');
  return publicUser(user);
}

export async function updateProfile(userId, { firstName, lastName }) {
  const user = await updateUser(userId, { firstName, lastName });
  return publicUser(user);
}
