import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool, connectDB } from './config/db.js';
import router from './routers/index.js';
import User from './models/userModels.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/", router);

const startServer = async () => {
  try {
    // Kết nối đến database
    await connectDB();
    console.log('Connected to PostgreSQL database');

    // Tạo bảng users nếu chưa tồn tại
    await User.createTable();
    console.log('Users table checked/created');

    // Khởi động server
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Xử lý lỗi không được bắt
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

export default app;