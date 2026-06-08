import {
  getCartItems,
  upsertCartItem,
  updateCartItemQuantity,
  deleteCartItem,
} from '../db/cartRepo.js';
import { findProductById } from '../db/productRepo.js';
import { notFound } from '../utils/ApiError.js';

// Cart totals are computed in integer cents to avoid float rounding (Guidelines §7).
function summarize(items) {
  const count = items.reduce((n, i) => n + i.quantity, 0);
  const subtotalCents = items.reduce(
    (c, i) => c + Math.round(i.productPrice * 100) * i.quantity,
    0
  );
  return { count, subtotal: Number((subtotalCents / 100).toFixed(2)) };
}

export async function getCart(userId) {
  const items = await getCartItems(userId);
  return { items, ...summarize(items) };
}

export async function addItem(userId, productId, quantity) {
  const product = await findProductById(productId);
  if (!product) throw notFound('Product not found', 'PRODUCT_NOT_FOUND');
  await upsertCartItem(userId, productId, quantity);
  return getCart(userId);
}

export async function updateItem(userId, itemId, quantity) {
  const updated = await updateCartItemQuantity(itemId, userId, quantity);
  if (!updated) throw notFound('Cart item not found', 'CART_ITEM_NOT_FOUND');
  return getCart(userId);
}

export async function removeItem(userId, itemId) {
  const ok = await deleteCartItem(itemId, userId);
  if (!ok) throw notFound('Cart item not found', 'CART_ITEM_NOT_FOUND');
  return getCart(userId);
}
