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

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/", router);

const startServer = async () => {
  try {
    await connectDB();
    console.log('Connected to PostgreSQL database');

    await User.createTable();
    console.log('Users table checked/created');
    await Role.createTable();
    console.log('Roles table checked/created');
    await faculty.createTable();
    console.log('Faculties table checked/created');

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

    

    // Khởi động server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Swagger UI is available at http://localhost:${PORT}/api-docs`);
    });
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