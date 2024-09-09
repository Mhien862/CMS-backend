import User from "../models/userModels.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // Thêm import jwt

export const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    const user = await User.findByEmail(email);
    console.log(user);
    if (!user) {
        return res.status(400).json({
            message: "User not found",
        });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({
            message: "Password is incorrect",
        });
    }
    
    // Tạo token cho người dùng
    const token = jwt.sign({ id: user.id, role: user.role }, 'secret_key'); // Thay 'secret_key' bằng khóa bí mật của bạn
    // Remove password from user object before sending
    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json({
        message: "Login successfully",
        data: userWithoutPassword,
        token, // Trả về token
    });
};

export const register = async (req, res) => {
    // Kiểm tra token
    const token = req.headers.authorization?.split(" ")[1]; // Lấy token từ header
    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, 'secret_key'); // Xác thực token
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: "Only administrators can use the registration function" }); // Chỉ cho phép admin
        }
    // ... existing code ...
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
