import { pool } from "../config/db.js";

const User = {
  async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50),
        faculty VARCHAR(50),
        agreement BOOLEAN DEFAULT false
      )
    `;
    await pool.query(query);
  },

  // Thêm user mới
  async create(user) {
    const { username, email, password, role, faculty, agreement } = user;
    const query = `
      INSERT INTO users (username, email, password, role, faculty, agreement)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [username, email, password, role, faculty, agreement];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Tìm user theo username
  async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(query, [username]);
    return result.rows[0];
  },

  // Tìm user theo email
  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  // Cập nhật thông tin user
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

  // Xóa user
  async deleteUser(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async findAllUser() {
    const query = 'SELECT * FROM users';
    const result = await pool.query(query);
    return result.rows;
  }
};

export default User;