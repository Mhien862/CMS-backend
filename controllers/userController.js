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
        const result = await pool.query(query)
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


export const deleteUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const query = 'DELETE FROM users WHERE id = $1';
        await pool.query(query, [userId]);
        return res.status(200).json({
            message: "Delete user successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while deleting user",
            error: error.message
        });
    }
}

export const updateUser = async (req, res) => {
    const { userId } = req.params;
    const { username, email, role } = req.body;
    try {
        const query = 'UPDATE users SET username = $1, email = $2, role = $3 WHERE id = $4';
        await pool.query(query, [username, email, role, userId]);
        return res.status(200).json({
            message: "Update user successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while updating user",
            error: error.message
        });
    }
}

export const getRole = async (req, res) => {
    try {
        const query = 'SELECT * FROM roles';
        const result = await pool.query(query);
        return res.status(200).json({
            message: "Get list role successfully",
            data: result.rows
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "An error occurred while fetching roles",
            error: error.message
        });
    }
};

export const getInformationUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const query = 'SELECT * FROM users WHERE id = $1';
        const result = await pool.query(query, [userId]);
        return res.status(200).json({
            message: "Get user information successfully",
            data: result.rows[0]
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while fetching user information",
            error: error.message
        });
    }
}

