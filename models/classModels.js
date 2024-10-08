import { pool } from "../config/db.js";

const Class = {
    async createTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS classes (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                faculty_id INTEGER REFERENCES faculties(id),
                teacher_id INTEGER REFERENCES users(id),
                password VARCHAR(255) NOT NULL
            )
        `;
        await pool.query(query);
    },

    async create(classData) {
        const { name, faculty_id, teacher_id, password } = classData;
        const query = `
            INSERT INTO classes (name, faculty_id, teacher_id, password)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const values = [name, faculty_id, teacher_id, password];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    async findById(id) {
        const query = 'SELECT * FROM classes WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    async getAllClasses() {
        const query = 'SELECT * FROM classes';
        const result = await pool.query(query);
        return result.rows;
    },

    async updateClass(id, updateData) {
        const { name, faculty_id, teacher_id } = updateData;
        const query = `
            UPDATE classes
            SET name = $1, faculty_id = $2, teacher_id = $3
            WHERE id = $4
            RETURNING *
        `;
        const values = [name, faculty_id, teacher_id, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    async deleteClass(id) {
        const query = 'DELETE FROM classes WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    async getAvailableTeachers(faculty_id) {
        const query = `
            SELECT * FROM users
            WHERE role_id = 2 AND faculty_id = $1
        `;
        const result = await pool.query(query, [faculty_id]);
        return result.rows;
    },

    async getClassWithDetails(id) {
        const query = `
            SELECT c.*, f.name AS faculty_name, u.username AS teacher_name
            FROM classes c
            LEFT JOIN faculties f ON c.faculty_id = f.id
            LEFT JOIN users u ON c.teacher_id = u.id
            WHERE c.id = $1
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
};

export default Class;