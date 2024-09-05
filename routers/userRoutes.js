import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();


router.get("/", async (req, res) => {
  res.send("Connected to PostgreSQL database");
});
// Route để lấy tất cả users
router.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route "Hello World" ban đầu
router.get("/user", (req, res) => { 
  res.send("Hello World");
});

// Route để tạo một user mới
router.post("/users", async (req, res) => {
  const { username, email } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *",
      [username, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;