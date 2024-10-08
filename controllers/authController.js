import User from "../models/userModels.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password",
            });
        }

        // Kiểm tra is_active
        if (!user.is_active) {
            return res.status(403).json({
                message: "Your account is inactive. Please contact an administrator.",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role_id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const { password: _, ...userWithoutPassword } = user;

        return res.status(200).json({
            message: "Login successful",
            user: userWithoutPassword,
            token,
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            message: "An error occurred during login",
            error: error.message
        });
    }
};

export const register = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        if (decoded.role !== 1) { 
            return res.status(403).json({ message: "Only administrators can use the registration function" });
        }
        
        const { email, password, role_id, username, faculty, faculty_id } = req.body;
        const facultyId = faculty_id || faculty; 
        
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            email,
            password: hashedPassword,
            role_id,
            username,
            faculty_id: facultyId,
            is_active: true
        });
        
        console.log('User created:', newUser);
        const { password: _, ...userWithoutPassword } = newUser;
        
        return res.status(201).json({
            message: "User registered successfully",
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: "Error registering new user", error: error.message });
    }
};