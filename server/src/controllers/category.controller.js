import asyncHandler from '../utils/asyncHandler.js';
import * as categoryService from '../services/category.service.js';

export const list = asyncHandler(async (_req, res) => {
  const data = await categoryService.list();
  res.json({ data });
});
