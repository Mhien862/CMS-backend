import { pool } from "../config/db.js";
const Semester = {
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

    async delete(id) {
        const query = `DELETE FROM semesters WHERE id = $1 RETURNING *`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },
};

export default Semester;
