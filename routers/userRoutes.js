import express from "express";
import User from "../models/userModels.js";
const router = express.Router();
router.get("/user", (req, res) => { 
  res.send("Hello World");
});

export default router;
