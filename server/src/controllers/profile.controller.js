import asyncHandler from '../utils/asyncHandler.js';
import * as profileService from '../services/profile.service.js';

export const get = asyncHandler(async (req, res) => {
  const user = await profileService.getProfile(req.user.id);
  res.json({ user });
});

export const update = asyncHandler(async (req, res) => {
  const user = await profileService.updateProfile(req.user.id, req.body);
  res.json({ user });
});
