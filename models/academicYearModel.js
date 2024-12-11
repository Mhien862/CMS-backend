import { pool } from "../config/db.js";

const AcademicYear = {
    async createTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS academic_years (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                start_year INTEGER NOT NULL,
                end_year INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await pool.query(query);
    },

    async create(data) {
        const query = `
            INSERT INTO academic_years (name, start_year, end_year)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const values = [data.name, data.start_year, data.end_year];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    async getAll() {
        const query = `SELECT * FROM academic_years ORDER BY start_year ASC`;
        const result = await pool.query(query);
        return result.rows;
    },

    async findById(id) {
        const query = `SELECT * FROM academic_years WHERE id = $1`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    async delete(id) {
        const query = `DELETE FROM academic_years WHERE id = $1 RETURNING *`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },
};

export default AcademicYear;