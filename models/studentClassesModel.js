import { pool } from "../config/db.js";

const StudentClasses = {
  async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS student_classes (
        id SERIAL PRIMARY KEY,
        student_id INTEGER NOT NULL,
        class_id INTEGER NOT NULL,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES users(id),
        FOREIGN KEY (class_id) REFERENCES classes(id),
        UNIQUE (student_id, class_id)
      )
    `;
    await pool.query(query);
  },

  async create(studentId, classId) {
    const query = `
      INSERT INTO student_classes (student_id, class_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    const values = [studentId, classId];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findByStudentId(studentId) {
    const query = 'SELECT * FROM student_classes WHERE student_id = $1';
    const result = await pool.query(query, [studentId]);
    return result.rows;
  },

  async findByClassId(classId) {
    const query = 'SELECT * FROM student_classes WHERE class_id = $1';
    const result = await pool.query(query, [classId]);
    return result.rows;
  },

  async findByStudentAndClass(studentId, classId) {
    const query = 'SELECT * FROM student_classes WHERE student_id = $1 AND class_id = $2';
    const result = await pool.query(query, [studentId, classId]);
    return result.rows[0];
  },

  async removeStudentFromClass(studentId, classId) {
    const query = 'DELETE FROM student_classes WHERE student_id = $1 AND class_id = $2 RETURNING *';
    const result = await pool.query(query, [studentId, classId]);
    return result.rows[0];
  },

  async getStudentClassesWithDetails(studentId) {
    const query = `
      SELECT sc.*, c.name AS class_name, u.username AS teacher_name
      FROM student_classes sc
      JOIN classes c ON sc.class_id = c.id
      JOIN users u ON c.teacher_id = u.id
      WHERE sc.student_id = $1
    `;
    const result = await pool.query(query, [studentId]);
    return result.rows;
  },

  async getClassStudentsWithDetails(classId) {
    const query = `
      SELECT sc.*, u.username AS student_name, u.email AS student_email
      FROM student_classes sc
      JOIN users u ON sc.student_id = u.id
      WHERE sc.class_id = $1
    `;
    const result = await pool.query(query, [classId]);
    return result.rows;
  },

  async isStudentInClass(studentId, classId) {
    const query = 'SELECT EXISTS(SELECT 1 FROM student_classes WHERE student_id = $1 AND class_id = $2)';
    const result = await pool.query(query, [studentId, classId]);
    return result.rows[0].exists;
  }
};

export default StudentClasses;