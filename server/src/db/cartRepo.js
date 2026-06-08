import { query } from './pool.js';

function toCartItem(row) {
  return {
    id:           row.id,
    userId:       row.user_id,
    productId:    row.product_id,
    quantity:     row.quantity,
    productName:  row.product_name  ?? null,
    productSlug:  row.product_slug  ?? null,
    productPrice: row.product_price !== undefined ? parseFloat(row.product_price) : null,
    primaryImage: row.primary_image ?? null,
    createdAt:    row.created_at,
    updatedAt:    row.updated_at,
  };
}

export async function getCartItems(userId) {
  const rows = await query(
    `SELECT ci.*,
            p.name  AS product_name,
            p.slug  AS product_slug,
            p.price AS product_price,
            (SELECT url FROM product_images pi
             WHERE pi.product_id = p.id
             ORDER BY pi.display_order ASC LIMIT 1) AS primary_image
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.user_id = ?
     ORDER BY ci.created_at ASC`,
    [userId]
  );
  return rows.map(toCartItem);
}

export async function upsertCartItem(userId, productId, quantity) {
  await query(
    `INSERT INTO cart_items (user_id, product_id, quantity)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity), updated_at = NOW()`,
    [userId, productId, quantity]
  );
  const rows = await query(
    'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ? LIMIT 1',
    [userId, productId]
  );
  return rows[0] ? toCartItem(rows[0]) : null;
}

export async function updateCartItemQuantity(itemId, userId, quantity) {
  const result = await query(
    'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?',
    [quantity, itemId, userId]
  );
  if (result.affectedRows === 0) return null;
  const rows = await query('SELECT * FROM cart_items WHERE id = ? LIMIT 1', [itemId]);
  return rows[0] ? toCartItem(rows[0]) : null;
}

export async function deleteCartItem(itemId, userId) {
  const result = await query(
    'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
    [itemId, userId]
  );
  return result.affectedRows > 0;
}

export async function clearCart(userId, conn) {
  const exec = conn
    ? (sql, p) => conn.execute(sql, p)
    : (sql, p) => query(sql, p);
  await exec('DELETE FROM cart_items WHERE user_id = ?', [userId]);
}
