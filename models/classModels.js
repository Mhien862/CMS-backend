import { pool } from "../config/db.js";

const Class = {
    // Tạo bảng classes với cột semester_id
    async createTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS classes (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                faculty_id INTEGER REFERENCES faculties(id),
                teacher_id INTEGER REFERENCES users(id),
                password VARCHAR(255) NOT NULL,
                semester_id INTEGER REFERENCES semesters(id)
            )
        `;
        await pool.query(query);
    },

    // Tạo một lớp học mới với semester_id
    async create(classData) {
        const { name, faculty_id, teacher_id, password, semester_id } = classData;
        const query = `
            INSERT INTO classes (name, faculty_id, teacher_id, password, semester_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const values = [name, faculty_id, teacher_id, password, semester_id];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    async getBySemester(semesterId) {
        const query = `
            SELECT c.*, s.name AS semester_name, ay.name AS academic_year_name
            FROM classes c
            LEFT JOIN semesters s ON c.semester_id = s.id
            LEFT JOIN academic_years ay ON s.academic_year_id = ay.id
            WHERE c.semester_id = $1
        `;
        const result = await pool.query(query, [semesterId]);
        return result.rows;
    },

    // Tìm lớp học theo ID
    async findById(id) {
        const query = 'SELECT * FROM classes WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    // Lấy danh sách tất cả các lớp học kèm thông tin học kỳ, khoa và giáo viên
    async getAllClasses() {
        const query = `
            SELECT 
                c.*, 
                f.name AS faculty_name, 
                u.username AS teacher_name, 
                s.name AS semester_name
            FROM classes c
            LEFT JOIN faculties f ON c.faculty_id = f.id
            LEFT JOIN users u ON c.teacher_id = u.id
            LEFT JOIN semesters s ON c.semester_id = s.id
        `;
        const result = await pool.query(query);
        return result.rows;
    },

    // Cập nhật thông tin lớp học (bao gồm semester_id)
    async updateClass(id, updateData) {
        const { name, faculty_id, teacher_id, semester_id } = updateData;
        const query = `
            UPDATE classes
            SET name = $1, faculty_id = $2, teacher_id = $3, semester_id = $4
            WHERE id = $5
            RETURNING *
        `;
        const values = [name, faculty_id, teacher_id, semester_id, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Xóa một lớp học
    async deleteClass(id) {
        const query = 'DELETE FROM classes WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    // Lấy danh sách giáo viên theo khoa
    async getAvailableTeachers(faculty_id) {
        const query = `
            SELECT * FROM users
            WHERE role_id = 2 AND faculty_id = $1
        `;
        const result = await pool.query(query, [faculty_id]);
        return result.rows;
    },

    // Lấy thông tin chi tiết của một lớp học (bao gồm semester_id và tên học kỳ)
    async getClassWithDetails(id) {
        const query = `
            SELECT 
                c.*, 
                f.name AS faculty_name, 
                u.username AS teacher_name, 
                s.name AS semester_name
            FROM classes c
            LEFT JOIN faculties f ON c.faculty_id = f.id
            LEFT JOIN users u ON c.teacher_id = u.id
            LEFT JOIN semesters s ON c.semester_id = s.id
            WHERE c.id = $1
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    // Lấy danh sách các lớp theo học kỳ
    async getClassesBySemester(semester_id) {
        const query = `
            SELECT 
                c.*, 
                f.name AS faculty_name, 
                u.username AS teacher_name
            FROM classes c
            LEFT JOIN faculties f ON c.faculty_id = f.id
            LEFT JOIN users u ON c.teacher_id = u.id
            WHERE c.semester_id = $1
        `;
        const result = await pool.query(query, [semester_id]);
        return result.rows;
    },
};

export default Class;
