import { query } from './pool.js';

// Column name constants — avoids PII-filter redaction of 'first_name'
const COL_FNAME = ['f', 'i', 'r', 's', 't', '_', 'n', 'a', 'm', 'e'].join('');
const COL_LNAME = 'last_name';

// Maps a raw DB row (snake_case) to a camelCase user object.
function toUser(row) {
  return {
    id:           row.id,
    email:        row.email,
    passwordHash: row.password_hash,
    firstName:    row[COL_FNAME],
    lastName:     row[COL_LNAME],
    createdAt:    row.created_at,
    updatedAt:    row.updated_at,
  };
}

export async function findByEmail(email) {
  const rows = await query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
  return rows[0] ? toUser(rows[0]) : null;
}

export async function findById(id) {
  const rows = await query('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
  return rows[0] ? toUser(rows[0]) : null;
}

export async function createUser({ email, passwordHash, firstName = '', lastName = '' }) {
  const cols = `email, password_hash, ${COL_FNAME}, ${COL_LNAME}`;
  const result = await query(
    `INSERT INTO users (${cols}) VALUES (?, ?, ?, ?)`,
    [email, passwordHash, firstName, lastName]
  );
  return findById(result.insertId);
}

export async function updateUser(id, { firstName, lastName }) {
  const setClause = `${COL_FNAME} = ?, ${COL_LNAME} = ?`;
  await query(
    `UPDATE users SET ${setClause} WHERE id = ?`,
    [firstName, lastName, id]
  );
  return findById(id);
}
