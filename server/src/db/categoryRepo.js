import { query } from './pool.js';

function toCategory(row) {
  return {
    id:          row.id,
    name:        row.name,
    slug:        row.slug,
    description: row.description,
    imageUrl:    row.image_url,
    createdAt:   row.created_at,
    updatedAt:   row.updated_at,
  };
}

export async function listCategories() {
  const rows = await query('SELECT * FROM categories ORDER BY name ASC');
  return rows.map(toCategory);
}

export async function findCategoryBySlug(slug) {
  const rows = await query('SELECT * FROM categories WHERE slug = ? LIMIT 1', [slug]);
  return rows[0] ? toCategory(rows[0]) : null;
}
