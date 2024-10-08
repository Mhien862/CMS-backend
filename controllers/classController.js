import bcrypt from 'bcrypt';
import { pool } from '../config/db.js';

export const createClass = async (req, res) => {
    const { name, faculty_id, teacher_id, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `
            INSERT INTO classes (name, faculty_id, teacher_id, password)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const values = [name, faculty_id, teacher_id, hashedPassword];
        const result = await pool.query(query, values);
        return res.status(201).json({
            message: "Class created successfully",
            data: result.rows[0]
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while creating the class",
            error: error.message
        });
    }
};

export const getAllClasses = async (req, res) => {
    try {
        const query = `
            SELECT * FROM classes
        `;
        const result = await pool.query(query);
        return res.status(200).json({
            message: "Classes retrieved successfully",
            data: result.rows
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while fetching classes",
            error: error.message
        });
    }
};

export const getClassById = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT c.*, f.name AS faculty_name, u.username AS teacher_name
            FROM classes c
            LEFT JOIN faculties f ON c.faculty_id = f.id
            LEFT JOIN users u ON c.teacher_id = u.id
            WHERE c.id = $1
        `;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Class not found",
            });
        }

        return res.status(200).json({
            message: "Get class information successfully",
            data: result.rows[0]
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while fetching class information",
            error: error.message
        });
    }
};

export const updateClass = async (req, res) => {
    const { id } = req.params;
    const { name, faculty_id, teacher_id, password } = req.body;
    try {
        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const query = `
            UPDATE classes
            SET name = $1, faculty_id = $2, teacher_id = $3, password = COALESCE($4, password)
            WHERE id = $5
            RETURNING *
        `;
        const values = [name, faculty_id, teacher_id, hashedPassword, id];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Class not found",
            });
        }

        return res.status(200).json({
            message: "Class updated successfully",
            data: result.rows[0]
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while updating the class",
            error: error.message
        });
    }
};

export const deleteClass = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            DELETE FROM classes
            WHERE id = $1
            RETURNING *
        `;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Class not found",
            });
        }

        return res.status(200).json({
            message: "Class deleted successfully",
            data: result.rows[0]
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while deleting the class",
            error: error.message
        });
    }
};

export const getAvailableTeachers = async (req, res) => {
    const { faculty_id } = req.params;
    try {
        const query = `
            SELECT * FROM users
            WHERE role_id = 2 AND faculty_id = $1
        `;
        const result = await pool.query(query, [faculty_id]);
        return res.status(200).json({
            message: "Available teachers retrieved successfully",
            data: result.rows
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while fetching available teachers",
            error: error.message
        });
    }
};

export const initializeClassesTable = async (req, res) => {
    try {
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
        return res.status(200).json({
            message: "Classes table initialized successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while initializing the classes table",
            error: error.message
        });
    }
};