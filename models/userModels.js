import { pool } from "../config/db.js";

const User = {
  async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role_id INTEGER REFERENCES roles(id),
        faculty_id INTEGER REFERENCES faculties(id),
        is_active BOOLEAN DEFAULT true
      )
    `;
    await pool.query(query);
  },

  async create(user) {
    const { username, email, password, role_id, faculty_id, is_active } = user;
    const query = `
      INSERT INTO users (username, email, password, role_id, faculty_id, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [username, email, password, role_id, faculty_id, is_active];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(query, [username]);
    return result.rows[0];
  },

  async updateUser(id, updateData) {
    const keys = Object.keys(updateData);
    const values = Object.values(updateData);
    const setString = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    const query = `
      UPDATE users
      SET ${setString}
      WHERE id = $${keys.length + 1}
      RETURNING *
    `;
    const result = await pool.query(query, [...values, id]);
    return result.rows[0];
  },

  async deleteUser(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async getUserWithDetails(id) {
    const query = `
      SELECT u.*, r.name AS role_name, f.name AS faculty_name
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      LEFT JOIN faculties f ON u.faculty_id = f.id
      WHERE u.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async activateUser(id) {
    const query = `
      UPDATE users
      SET is_active = true
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async deactivateUser(id) {
    const query = `
      UPDATE users
      SET is_active = false
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async findActiveUserByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }
};

export default User;