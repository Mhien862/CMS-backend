import { pool } from "../config/db.js";

const Faculty = {
  async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS faculties (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL
      )
    `;
    await pool.query(query);
  },

  async create(name) {
    const query = 'INSERT INTO faculties (name) VALUES ($1) RETURNING *';
    const result = await pool.query(query, [name]);
    return result.rows[0];
  },

  async findAll() {
    const query = 'SELECT * FROM faculties';
    const result = await pool.query(query);
    return result.rows;
  },

  async findById(id) {
    const query = 'SELECT * FROM faculties WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async update(id, name) {
    const query = 'UPDATE faculties SET name = $1 WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [name, id]);
    return result.rows[0];
  },

  async delete(id) {
    const query = 'DELETE FROM faculties WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};

export default Faculty;