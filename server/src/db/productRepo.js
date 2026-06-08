import { query } from './pool.js';

function toProduct(row) {
  return {
    id:            row.id,
    categoryId:    row.category_id,
    categoryName:  row.category_name ?? null,
    categorySlug:  row.category_slug ?? null,
    name:          row.name,
    slug:          row.slug,
    description:   row.description,
    price:         parseFloat(row.price),
    stockQuantity: row.stock_quantity,
    active:        Boolean(row.active),
    createdAt:     row.created_at,
    updatedAt:     row.updated_at,
  };
}

function toImage(row) {
  return {
    id:           row.id,
    url:          row.url,
    altText:      row.alt_text,
    displayOrder: row.display_order,
  };
}

// Safe sort map — keys are the allowed ?sort= values
const SORT_MAP = {
  price_asc:  'p.price ASC',
  price_desc: 'p.price DESC',
  name_asc:   'p.name ASC',
  name_desc:  'p.name DESC',
  newest:     'p.created_at DESC',
};

/**
 * List products with optional search/filter/sort/pagination.
 * Returns { data, page, limit, total }.
 */
export async function listProducts({ search, category, minPrice, maxPrice, sort, page, limit }) {
  const conditions = ['p.active = 1'];
  const params     = [];

  if (search) {
    conditions.push('(p.name LIKE ? OR p.description LIKE ?)');
    const term = `%${search}%`;
    params.push(term, term);
  }
  if (category) {
    conditions.push('c.slug = ?');
    params.push(category);
  }
  if (minPrice !== undefined) {
    conditions.push('p.price >= ?');
    params.push(minPrice);
  }
  if (maxPrice !== undefined) {
    conditions.push('p.price <= ?');
    params.push(maxPrice);
  }

  const where   = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const orderBy = SORT_MAP[sort] ?? 'p.created_at DESC';
  const offset  = (page - 1) * limit;

  const countRows = await query(
    `SELECT COUNT(*) AS total
     FROM products p
     LEFT JOIN categories c ON c.id = p.category_id
     ${where}`,
    params
  );
  const total = Number(countRows[0].total);

  const rows = await query(
    `SELECT p.*,
            c.name AS category_name,
            c.slug AS category_slug,
            (SELECT url FROM product_images pi
             WHERE pi.product_id = p.id
             ORDER BY pi.display_order ASC LIMIT 1) AS primary_image
     FROM products p
     LEFT JOIN categories c ON c.id = p.category_id
     ${where}
     ORDER BY ${orderBy}
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const data = rows.map((row, i) => ({
    ...toProduct(row),
    primaryImage: rows[i].primary_image ?? null,
  }));

  return { data, total };
}

/**
 * Get a single product by id or slug, including all images and category.
 */
export async function findProduct(idOrSlug) {
  const field = typeof idOrSlug === 'number' ? 'p.id' : 'p.slug';
  const rows = await query(
    `SELECT p.*,
            c.name AS category_name,
            c.slug AS category_slug
     FROM products p
     LEFT JOIN categories c ON c.id = p.category_id
     WHERE ${field} = ? AND p.active = 1
     LIMIT 1`,
    [idOrSlug]
  );
  if (!rows[0]) return null;

  const product = toProduct(rows[0]);

  const images = await query(
    'SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order ASC',
    [product.id]
  );
  product.images = images.map(toImage);

  return product;
}

export async function findProductById(id) {
  return findProduct(Number(id));
}
