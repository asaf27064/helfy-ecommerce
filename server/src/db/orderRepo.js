import { query } from './pool.js';

function rowToOrder(row) {
  return {
    id:                 row.id,
    userId:             row.user_id,
    status:             row.status,
    subtotal:           parseFloat(row.subtotal),
    shippingAmount:     parseFloat(row.shipping_amount),
    taxAmount:          parseFloat(row.tax_amount),
    total:              parseFloat(row.total),
    shippingName:       row.shipping_name,
    shippingStreet1:    row.shipping_street1,
    shippingStreet2:    row.shipping_street2 ?? null,
    shippingCity:       row.shipping_city,
    shippingState:      row.shipping_state,
    shippingPostalCode: row.shipping_postal_code,
    shippingCountry:    row.shipping_country,
    createdAt:          row.created_at,
    updatedAt:          row.updated_at,
  };
}

function rowToItem(row) {
  return {
    id:           row.id,
    orderId:      row.order_id,
    productId:    row.product_id,
    productName:  row.product_name,
    productPrice: parseFloat(row.product_price),
    quantity:     row.quantity,
    lineTotal:    parseFloat(row.line_total),
  };
}

/**
 * Create an order and its line items inside an existing transaction connection.
 * Returns the new order id.
 */
export async function createOrder(conn, { userId, subtotal, shippingAmount, taxAmount, total, shipping, items }) {
  const [orderResult] = await conn.execute(
    `INSERT INTO orders
       (user_id, status, subtotal, shipping_amount, tax_amount, total,
        shipping_name, shipping_street1, shipping_street2,
        shipping_city, shipping_state, shipping_postal_code, shipping_country)
     VALUES (?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId, subtotal, shippingAmount, taxAmount, total,
      shipping.name, shipping.street1, shipping.street2 ?? null,
      shipping.city, shipping.state, shipping.postalCode, shipping.country,
    ]
  );
  const orderId = orderResult.insertId;

  for (const item of items) {
    await conn.execute(
      `INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, line_total)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [orderId, item.productId, item.productName, item.productPrice, item.quantity, item.lineTotal]
    );
  }

  return orderId;
}

async function attachItems(orders) {
  if (orders.length === 0) return orders;
  const ids = orders.map((o) => o.id);
  const placeholders = ids.map(() => '?').join(',');
  const rows = await query(
    `SELECT * FROM order_items WHERE order_id IN (${placeholders}) ORDER BY id ASC`,
    ids
  );
  const byOrder = new Map();
  for (const r of rows) {
    if (!byOrder.has(r.order_id)) byOrder.set(r.order_id, []);
    byOrder.get(r.order_id).push(rowToItem(r));
  }
  for (const o of orders) o.items = byOrder.get(o.id) ?? [];
  return orders;
}

export async function listOrdersByUser(userId) {
  const rows = await query(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return attachItems(rows.map(rowToOrder));
}

export async function findOrderById(orderId) {
  const rows = await query('SELECT * FROM orders WHERE id = ? LIMIT 1', [orderId]);
  if (!rows[0]) return null;
  const order = rowToOrder(rows[0]);
  const itemRows = await query(
    'SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC',
    [orderId]
  );
  order.items = itemRows.map(rowToItem);
  return order;
}
