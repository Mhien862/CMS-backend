import pg from 'pg';
import dotenv from 'dotenv';


dotenv.config();
const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const connectDB = async () => {
  try {
    await pool.connect();
    console.log("PostgreSQL connection SUCCESS");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export { pool, connectDB };