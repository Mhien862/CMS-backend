import User from "../models/userModels.js";
import bcrypt from "bcrypt";
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
    // Remove password from user object before sending
    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json({
        message: "Login successfully",
        data: userWithoutPassword,
    });
};

export const register = (async (req, res) => {
    
    const { username, email, password, role, faculty, agreement } = req.body;
    
    // Validate input
    if (!username || !email || !password) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }

    try {
        // Kiểm tra xem email đã tồn tại chưa
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
          return res.status(400).json({ message: "Email already in use" });
        }

        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
          return res.status(400).json({ message: "Username already in use" });
        }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
        username,
        email,
        password: hashedPassword, 
        role: role || 'user',
        faculty,
        agreement
    });

    return res.status(201).json({
        message: "User created successfully",
        data: userWithoutPassword,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error creating user" });
    }
});
