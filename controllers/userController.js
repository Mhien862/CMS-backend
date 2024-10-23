import { pool } from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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



export const getMe = async (req, res) => {
    try {
        
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

       
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        
        const query = `
            SELECT u.id, u.username, u.email, u.role_id, u.faculty_id, u.is_active,
                   r.name AS role_name, f.name AS faculty_name
            FROM users u
            LEFT JOIN roles r ON u.role_id = r.id
            LEFT JOIN faculties f ON u.faculty_id = f.id
            WHERE u.id = $1
        `;

        const result = await pool.query(query, [decoded.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = result.rows[0];

        
        if (!user.is_active) {
            return res.status(403).json({
                message: "Your account is inactive. Please contact an administrator.",
            });
        }

        // Return user information
        return res.status(200).json({
            message: "User information retrieved successfully",
            user: user
        });
    } catch (error) {
        console.error('Get user info error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        }
        return res.status(500).json({
            message: "An error occurred while retrieving user information",
            error: error.message
        });
    }
};

export const updatePassword = async (req, res) => {
    const { userId } = req.params;
    const { newPassword } = req.body;

    try {
    
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        const query = `
            UPDATE users 
            SET password = $1
            WHERE id = $2
            RETURNING id`;

        const result = await pool.query(query, [hashedPassword, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            message: "Password updated successfully",
        });
    } catch (error) {
        console.error('Update password error:', error);
        return res.status(500).json({
            message: "An error occurred while updating password",
            error: error.message
        });
    }
};




