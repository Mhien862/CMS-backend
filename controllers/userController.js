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
        const query = 'SELECT * FROM users ORDER BY id ASC'; 
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
    const { username, email, role_id, faculty_id, is_active } = req.body;

    try {
        const query = `
            UPDATE users 
            SET username = $1, 
                email = $2, 
                role_id = $3, 
                faculty_id = $4, 
                is_active = $5
            WHERE id = $6
            RETURNING id, username, email, role_id, faculty_id, is_active`;

        const result = await pool.query(query, [username, email, role_id, faculty_id || null, is_active, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            message: "Update user successfully",
            user: result.rows[0]
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

export const getFaculty = async (req, res) => {
    try {
        const query = 'SELECT * FROM faculties';
        const result = await pool.query(query)
        return res.status(200).json({
            message: "Get list faculty successfully",
            data: result.rows
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while fetching faculties",
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
};

export const updateUserStatus = async (req, res) => {
    const { userId } = req.params;
    const { is_active } = req.body;

    try {
        const query = `
            UPDATE users 
            SET is_active = $1
            WHERE id = $2
            RETURNING id, username, email, role_id, faculty_id, is_active`;

        const result = await pool.query(query, [is_active, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            message: "User status updated successfully",
            user: result.rows[0]
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while updating user status",
            error: error.message
        });
    }
};

export const listTeacher = async (req, res) => {
    try {
        const query = 'SELECT * FROM users WHERE role_id = 2';
        const result = await pool.query(query);
        return res.status(200).json({
            message: "Get list teacher successfully",
            data: result.rows
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while fetching teachers",
            error: error.message
        });
    }
}




