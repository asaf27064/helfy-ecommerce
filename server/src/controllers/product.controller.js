import asyncHandler from '../utils/asyncHandler.js';
import * as productService from '../services/product.service.js';
import { badRequest } from '../utils/ApiError.js';

// Query params arrive as strings; coerce + clamp here before hitting the service.
function parseListQuery(q) {
  const page = Math.max(1, parseInt(q.page, 10) || 1);
  const limit = Math.min(60, Math.max(1, parseInt(q.limit, 10) || 12));
  const out = { page, limit };

  if (q.search) out.search = String(q.search);
  if (q.category) out.category = String(q.category);
  if (q.sort) out.sort = String(q.sort);

  if (q.minPrice !== undefined && q.minPrice !== '') {
    const n = Number(q.minPrice);
    if (!Number.isNaN(n)) out.minPrice = n;
  }
  if (q.maxPrice !== undefined && q.maxPrice !== '') {
    const n = Number(q.maxPrice);
    if (!Number.isNaN(n)) out.maxPrice = n;
  }
  return out;
}

export const list = asyncHandler(async (req, res) => {
  const result = await productService.list(parseListQuery(req.query));
  res.json(result);
});

export const getOne = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) throw badRequest('Invalid product id', 'INVALID_ID');
  const product = await productService.getById(id);
  res.json({ product });
});
