import asyncHandler from '../utils/asyncHandler.js';
import * as cartService from '../services/cart.service.js';
import { badRequest } from '../utils/ApiError.js';

function itemId(req) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) throw badRequest('Invalid cart item id', 'INVALID_ID');
  return id;
}

export const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user.id);
  res.json(cart);
});

export const addItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.addItem(req.user.id, productId, quantity);
  res.status(201).json(cart);
});

export const updateItem = asyncHandler(async (req, res) => {
  const cart = await cartService.updateItem(req.user.id, itemId(req), req.body.quantity);
  res.json(cart);
});

export const removeItem = asyncHandler(async (req, res) => {
  const cart = await cartService.removeItem(req.user.id, itemId(req));
  res.json(cart);
});
