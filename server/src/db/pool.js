import mysql from 'mysql2/promise';
import env from '../config/env.js';

// Singleton connection pool — shared across all repositories.
const pool = mysql.createPool({
  host:               env.db.host,
  port:               env.db.port,
  user:               env.db.user,
  password:           env.db.password,
  database:           env.db.name,
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  timezone:           'Z',
});

/**
 * Execute a parameterized query and return the rows.
 * @param {string} sql
 * @param {any[]}  params
 * @returns {Promise<any[]>}
 */
export async function query(sql, params = []) {
  // Use query() (text protocol) rather than execute() (prepared protocol):
  // prepared statements reject bound LIMIT/OFFSET values with
  // "Incorrect arguments to mysqld_stmt_execute". Params are still escaped.
  const [rows] = await pool.query(sql, params);
  return rows;
}

/**
 * Run multiple statements inside a single transaction.
 * @param {(conn: mysql.PoolConnection) => Promise<T>} fn
 * @returns {Promise<T>}
 */
export async function withTransaction(fn) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const result = await fn(conn);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export default pool;
