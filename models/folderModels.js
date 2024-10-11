import { pool } from "../config/db.js";

const Folder = {
  async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS folders (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        class_id INTEGER REFERENCES classes(id),
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);
  },

  async create(name, classId, createdBy) {
    const query = 'INSERT INTO folders (name, class_id, created_by) VALUES ($1, $2, $3) RETURNING *';
    const result = await pool.query(query, [name, classId, createdBy]);
    return result.rows[0];
  },

  async findAll() {
    const query = 'SELECT * FROM folders';
    const result = await pool.query(query);
    return result.rows;
  },

  async findById(id) {
    const query = 'SELECT * FROM folders WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async findByClassId(classId) {
    try {
      const query = 'SELECT * FROM folders WHERE class_id = $1';
      const result = await pool.query(query, [classId]);
      console.log(`Folders found for class ${classId}:`, result.rows);
      return result.rows;
    } catch (error) {
      console.error('Error in Folder.findByClassId:', error);
      throw error;
    }
  },

  async update(id, name) {
    const query = 'UPDATE folders SET name = $1 WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [name, id]);
    return result.rows[0];
  },

  async delete(id) {
    const query = 'DELETE FROM folders WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};

export default Folder;