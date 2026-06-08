import { withTransaction } from '../db/pool.js';
import { getCartItems, clearCart } from '../db/cartRepo.js';
import { createOrder, listOrdersByUser, findOrderById } from '../db/orderRepo.js';
import { badRequest, notFound } from '../utils/ApiError.js';

const FREE_SHIPPING_THRESHOLD_CENTS = 5000; // free shipping over $50
const FLAT_SHIPPING_CENTS = 599;            // $5.99 otherwise
const TAX_RATE = 0.08;                       // 8% mock tax

const toMoney = (cents) => Number((cents / 100).toFixed(2));

/**
 * Place an order from the user's current cart inside a transaction:
 * snapshot cart -> create order + items (price-at-purchase) -> clear cart.
 * Payment is mocked (always succeeds).
 */
export async function checkout(userId, shipping) {
  const cart = await getCartItems(userId);
  if (cart.length === 0) throw badRequest('Your cart is empty', 'CART_EMPTY');

  let subtotalCents = 0;
  const items = cart.map((ci) => {
    const priceCents = Math.round(ci.productPrice * 100);
    const lineCents = priceCents * ci.quantity;
    subtotalCents += lineCents;
    return {
      productId:    ci.productId,
      productName:  ci.productName,
      productPrice: toMoney(priceCents),
      quantity:     ci.quantity,
      lineTotal:    toMoney(lineCents),
    };
  });

  const shippingCents = subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : FLAT_SHIPPING_CENTS;
  const taxCents = Math.round(subtotalCents * TAX_RATE);
  const totalCents = subtotalCents + shippingCents + taxCents;

  const normalizedShipping = {
    name:       shipping.name,
    street1:    shipping.street1,
    street2:    shipping.street2 ?? null,
    city:       shipping.city,
    state:      shipping.state ?? '',
    postalCode: shipping.postalCode,
    country:    shipping.country ?? '',
  };

  const orderId = await withTransaction(async (conn) => {
    const id = await createOrder(conn, {
      userId,
      subtotal:       toMoney(subtotalCents),
      shippingAmount: toMoney(shippingCents),
      taxAmount:      toMoney(taxCents),
      total:          toMoney(totalCents),
      shipping:       normalizedShipping,
      items,
    });
    await clearCart(userId, conn);
    return id;
  });

  return findOrderById(orderId);
}

export async function listForUser(userId) {
  return listOrdersByUser(userId);
}

export async function getForUser(userId, orderId) {
  const order = await findOrderById(orderId);
  if (!order || order.userId !== userId) {
    throw notFound('Order not found', 'ORDER_NOT_FOUND');
  }
  return order;
}
