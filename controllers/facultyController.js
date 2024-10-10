import { pool } from '../config/db.js'; 


export const getAllFaculties = async (req, res) => {
    try {
        const query = `SELECT * FROM faculties ORDER BY id ASC`;
        const result = await pool.query(query);
        return res.status(200).json({
            message: "Faculties retrieved successfully",
            data: result.rows
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while fetching faculties",
            error: error.message
        });
    }
};


export const getFacultyById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `SELECT * FROM faculties WHERE id = $1 `;
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Faculty not found"
            });
        }

        return res.status(200).json({
            message: "Faculty retrieved successfully",
            data: result.rows[0]
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while fetching the faculty",
            error: error.message
        });
    }
};


export const createFaculty = async (req, res) => {
    try {
        const { name } = req.body;
        const query = `INSERT INTO faculties (name) VALUES ($1) RETURNING *`;
        const result = await pool.query(query, [name]);

        return res.status(201).json({
            message: "Faculty created successfully",
            data: result.rows[0]
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while creating the faculty",
            error: error.message
        });
    }
};


export const updateFaculty = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const query = `UPDATE faculties SET name = $1 WHERE id = $2 RETURNING *`;
        const result = await pool.query(query, [name, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Faculty not found"
            });
        }

        return res.status(200).json({
            message: "Faculty updated successfully",
            data: result.rows[0]
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while updating the faculty",
            error: error.message
        });
    }
};


export const deleteFaculty = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `DELETE FROM faculties WHERE id = $1 RETURNING *`;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Faculty not found"
            });
        }

        return res.status(200).json({
            message: "Faculty deleted successfully",
            data: result.rows[0]
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while deleting the faculty",
            error: error.message
        });
    }
};