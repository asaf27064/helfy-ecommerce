import asyncHandler from '../utils/asyncHandler.js';
import * as orderService from '../services/order.service.js';
import { badRequest } from '../utils/ApiError.js';

export const create = asyncHandler(async (req, res) => {
  const order = await orderService.checkout(req.user.id, req.body);
  res.status(201).json({ order });
});

export const list = asyncHandler(async (req, res) => {
  const data = await orderService.listForUser(req.user.id);
  res.json({ data });
});

export const getOne = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) throw badRequest('Invalid order id', 'INVALID_ID');
  const order = await orderService.getForUser(req.user.id, id);
  res.json({ order });
});
