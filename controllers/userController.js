import User from '../models/userModels.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const getOne = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.getUserWithDetails(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        return res.status(200).json({
            message: "Get user successfully",
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while fetching user",
            error: error.message
        });
    }
};

export const getListUser = async (req, res) => {
    try {
        const users = await User.getAllUsers();
        return res.status(200).json({
            message: "Get list user successfully",
            data: users
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
        const deletedUser = await User.deleteUser(userId);
        if (!deletedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        return res.status(200).json({
            message: "Delete user successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while deleting user",
            error: error.message
        });
    }
};

export const updateUser = async (req, res) => {
    const { userId } = req.params;
    const { username, email, role_id, faculty_id, is_active } = req.body;

    try {
        const updatedUser = await User.updateUser(userId, {
            username,
            email,
            role_id,
            faculty_id: faculty_id || null,
            is_active
        });

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            message: "Update user successfully",
            user: updatedUser
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while updating user",
            error: error.message
        });
    }
};

export const getRole = async (req, res) => {
    try {
        const roles = await User.getRoles();
        return res.status(200).json({
            message: "Get list role successfully",
            data: roles
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while fetching roles",
            error: error.message
        });
    }
};

export const getFaculty = async (req, res) => {
    try {
        const faculties = await User.getFaculties();
        return res.status(200).json({
            message: "Get list faculty successfully",
            data: faculties
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
        const user = await User.getUserWithDetails(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        return res.status(200).json({
            message: "Get user information successfully",
            data: user
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
        const updatedUser = is_active ? 
            await User.activateUser(userId) : 
            await User.deactivateUser(userId);

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            message: "User status updated successfully",
            user: updatedUser
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
        const teachers = await User.getTeachers();
        return res.status(200).json({
            message: "Get list teacher successfully",
            data: teachers
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while fetching teachers",
            error: error.message
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.getUserWithDetails(decoded.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.is_active) {
            return res.status(403).json({
                message: "Your account is inactive. Please contact an administrator.",
            });
        }

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

        const updatedUser = await User.updateUser(userId, {
            password: hashedPassword
        });

        if (!updatedUser) {
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