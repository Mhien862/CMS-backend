import { pool } from "../config/db.js";


const Assignment = {
  async createTable() {
    const query = `
    CREATE TABLE IF NOT EXISTS assignments (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      file_url VARCHAR(255),
      folder_id INTEGER REFERENCES folders(id),
      student_id INTEGER REFERENCES users(id),
      submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      grade NUMERIC(5,2),
      comment TEXT
    )
  `;
  await pool.query(query);
  },

  async create(title, description, fileUrl, folderId, studentId) {
    const query = 'INSERT INTO assignments (title, description, file_url, folder_id, student_id) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const result = await pool.query(query, [title, description, fileUrl, folderId, studentId]);
    return result.rows[0];
  },

  async update(id, title, description, fileUrl) {
    const query = 'UPDATE assignments SET title = $1, description = $2, file_url = $3 WHERE id = $4 RETURNING *';
    const result = await pool.query(query, [title, description, fileUrl, id]);
    return result.rows[0];
  },

  async findByFolderId(folderId) {
    const query = 'SELECT * FROM assignments WHERE folder_id = $1';
    const result = await pool.query(query, [folderId]);
    return result.rows;
  },

  async findByStudentId(studentId) {
    const query = 'SELECT * FROM assignments WHERE student_id = $1';
    const result = await pool.query(query, [studentId]);
    return result.rows;
  },

  async findById(id) {
    const query = 'SELECT * FROM assignments WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async update(id, title, description, fileUrl) {
    const query = 'UPDATE assignments SET title = $1, description = $2, file_url = $3 WHERE id = $4 RETURNING *';
    const result = await pool.query(query, [title, description, fileUrl, id]);
    return result.rows[0];
  },

  async delete(id) {
    const query = 'DELETE FROM assignments WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async getFileUrl(id) {
    const query = 'SELECT file_url FROM assignments WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0]?.file_url;
  },

   async findByStudentAndClass(studentId, classId) {
    const query = `
      SELECT a.* 
      FROM assignments a
      JOIN folders f ON a.folder_id = f.id
      WHERE a.student_id = $1 AND f.class_id = $2
    `;
    const result = await pool.query(query, [studentId, classId]);
    return result.rows;
  },
  async findByFolderId(folderId) {
    const query = `
      SELECT a.*, u.username as student_name
      FROM assignments a
      JOIN users u ON a.student_id = u.id
      WHERE a.folder_id = $1
    `;
    const result = await pool.query(query, [folderId]);
    return result.rows;
  },

  async updateGrade(id, grade) {
    const query = 'UPDATE assignments SET grade = $1 WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [grade, id]);
    return result.rows[0];
  },

  async updateGradeAndComment(id, grade, comment) {
    const query = 'UPDATE assignments SET grade = $1, comment = $2 WHERE id = $3 RETURNING *';
    const result = await pool.query(query, [grade, comment, id]);
    return result.rows[0];
  },

  async findByStudentAndClass(studentId, classId) {
    const query = `
      SELECT a.*, f.name as folder_name
      FROM assignments a
      JOIN folders f ON a.folder_id = f.id
      WHERE a.student_id = $1 AND f.class_id = $2
    `;
    const result = await pool.query(query, [studentId, classId]);
    return result.rows;
  },
  async findByStudentAndFolderInClass(studentId, classId, folderId) {
    const query = `
      SELECT 
        a.*,
        f.name as folder_name,
        c.name as class_name
      FROM assignments a
      JOIN folders f ON a.folder_id = f.id
      JOIN classes c ON f.class_id = c.id
      WHERE 
        a.student_id = $1 
        AND f.class_id = $2
        AND f.id = $3
    `;
    const result = await pool.query(query, [studentId, classId, folderId]);
    return result.rows;
  },
  
  async findByStudentAndFolderInClass(studentId, classId, folderId) {
    const query = `
        SELECT a.*
        FROM assignments a
        JOIN folders f ON a.folder_id = f.id
        WHERE a.student_id = $1 
        AND f.class_id = $2 
        AND f.id = $3
    `;
    const result = await pool.query(query, [studentId, classId, folderId]);
    return result.rows;
},

async getStudentGradesInClass(classId) {
    const query = `
        SELECT 
            u.id,
            u.username,
            u.email,
            sc.joined_at,
            COALESCE(
                jsonb_agg(
                    jsonb_build_object(
                        'assignment_id', a.id,
                        'folder_name', f.name,
                        'title', a.title,
                        'grade', a.grade
                    )
                ) FILTER (WHERE a.id IS NOT NULL),
                '[]'
            ) as assignments,
            ROUND(AVG(a.grade)::numeric, 2) as average_grade
        FROM student_classes sc
        JOIN users u ON sc.student_id = u.id
        LEFT JOIN assignments a ON a.student_id = u.id
        LEFT JOIN folders f ON a.folder_id = f.id
        WHERE sc.class_id = $1 AND f.class_id = $1
        GROUP BY u.id, u.username, u.email, sc.joined_at
        ORDER BY u.username
    `;
    const result = await pool.query(query, [classId]);
    return result.rows;
}
};


export default Assignment;