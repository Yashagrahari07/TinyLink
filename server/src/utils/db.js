import pool from '../db/connection.js';

// Execute a raw SQL query with parameters
export async function query(sql, params = []) {
  return await pool.query(sql, params);
}

// Execute a query and return a single row
export async function queryOne(sql, params = []) {
  const result = await query(sql, params);
  return result.rows[0] || null;
}

// Execute a query and return all rows
export async function queryMany(sql, params = []) {
  const result = await query(sql, params);
  return result.rows;
}

// Test database connection
export async function testConnection() {
  try {
    await query('SELECT NOW()');
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}

