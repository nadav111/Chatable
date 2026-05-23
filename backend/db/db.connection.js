import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config(); 

const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  port: 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const connectDB = async () => {
  try {
    console.log('Connecting to PostgreSQL...' + `Host: ${process.env.DB_HOST}, User: ${process.env.DB_USER}, Database: ${process.env.DB_NAME}`);
    await pool.connect();

    await pool.query('SELECT 1');
    
    console.log('✅ PostgreSQL connected');
    
  } catch (err) {
    console.error('❌ PostgreSQL connection failed:', err.message);
    process.exit(1);
  }
};

export default connectDB;