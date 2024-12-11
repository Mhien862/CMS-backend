import { pool } from "../config/db.js";

const Semester = {
    async createTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS semesters (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                academic_year_id INTEGER REFERENCES academic_years(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await pool.query(query);
    },

    async create(data) {
        const query = `
            INSERT INTO semesters (name, academic_year_id)
            VALUES ($1, $2)
            RETURNING *
        `;
        const values = [data.name, data.academic_year_id];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    async getByYear(academicYearId) {
        const query = `
            SELECT * FROM semesters
            WHERE academic_year_id = $1
            ORDER BY id ASC
        `;
        const result = await pool.query(query, [academicYearId]);
        return result.rows;
    },

    async getById(id) {
        const query = `
            SELECT s.*, ay.name as academic_year_name 
            FROM semesters s
            LEFT JOIN academic_years ay ON s.academic_year_id = ay.id
            WHERE s.id = $1
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    async update(id, data) {
        const query = `
            UPDATE semesters 
            SET name = $1, academic_year_id = $2
            WHERE id = $3
            RETURNING *
        `;
        const values = [data.name, data.academic_year_id, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    async delete(id) {
        const query = `DELETE FROM semesters WHERE id = $1 RETURNING *`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    async getClassesWithDetails(semesterId) {
        const query = `
            SELECT 
                c.*,
                f.name AS faculty_name,
                u.username AS teacher_name,
                s.name AS semester_name,
                ay.name AS academic_year_name
            FROM classes c
            LEFT JOIN faculties f ON c.faculty_id = f.id
            LEFT JOIN users u ON c.teacher_id = u.id
            LEFT JOIN semesters s ON c.semester_id = s.id
            LEFT JOIN academic_years ay ON s.academic_year_id = ay.id
            WHERE c.semester_id = $1
        `;
        const result = await pool.query(query, [semesterId]);
        return result.rows;
    },

    async getSemesterWithDetails(id) {
        const query = `
            SELECT s.*, 
                   ay.name as academic_year_name,
                   ay.start_year,
                   ay.end_year
            FROM semesters s
            LEFT JOIN academic_years ay ON s.academic_year_id = ay.id
            WHERE s.id = $1
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
};

export default Semester;