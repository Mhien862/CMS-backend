import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool, connectDB } from './config/db.js';
import router from './routers/index.js';
import User from './models/userModels.js';
import Role from './models/RoleModels.js';
import faculty from './models/facultyModels.js';
import { swaggerUi, specs } from './swagger.js';
import swaggerSpecs from './swagger.js';
import userRoutes from './routers/userRoutes.js';
import Class from './models/classModels.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/", router);

const startServer = async () => {
  try {
    // Kết nối đến cơ sở dữ liệu
    await connectDB();
    console.log('Connected to PostgreSQL database');

    // Tạo bảng
    try {
      await User.createTable();
      console.log('Users table checked/created');
      await Role.createTable();
      console.log('Roles table checked/created');
      await faculty.createTable();
      console.log('Faculties table checked/created');
      await Class.createTable();
      console.log('Classes table checked/created');
    } catch (tableError) {
      console.error('Error creating tables:', tableError.message);
      console.error('Table creation error stack:', tableError.stack);
      throw tableError;
    }

    // Thiết lập Swagger
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

    // Khởi động server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Swagger UI is available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    console.error('Server start error stack:', error.stack);
    
    // Kiểm tra lỗi cụ thể
    if (error.code === 'ECONNREFUSED') {
      console.error('Could not connect to the database. Please check your database configuration and ensure it is running.');
    } else if (error.code === 'ENOTFOUND') {
      console.error('Database host not found. Please check your DB_HOST environment variable.');
    } else if (error.code === '28P01') {
      console.error('Invalid database username or password. Please check your DB_USER and DB_PASSWORD environment variables.');
    } else if (error.code === '3D000') {
      console.error('Database does not exist. Please check your DB_NAME environment variable.');
    }

    // Log thông tin môi trường (ẩn thông tin nhạy cảm)
    console.log('Environment variables:');
    console.log('PORT:', process.env.PORT);
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_USER:', process.env.DB_USER);
    console.log('DB_NAME:', process.env.DB_NAME);
    console.log('DB_PORT:', process.env.DB_PORT);
    // Không log DB_PASSWORD vì lý do bảo mật

    process.exit(1);
  }
};

export { startServer, app };