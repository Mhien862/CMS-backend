import { pool } from "../config/db.js";

export const getOne = async (req, res) => {
    const { userId } = req.params;
    console.log(userId);
    return res.status(200).json({
        message: "Get user successfully",
    });
};

export const getListUser = async (req, res) => {
    try {
        const query = 'SELECT * FROM users';
        const result = await pool.query(query);
        return res.status(200).json({
            message: "Get list user successfully",
            data: result.rows
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while fetching users",
            error: error.message
        });
    }
};


