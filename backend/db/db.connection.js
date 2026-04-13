import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config(); 

const pool = new pg.Pool({
  host: process.env.DATABASE_HOST || 'localhost', // Changed from 'db-service'
  port: 5432,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB
});

const connectDB = async () => {
  try {
    console.log('Connecting to PostgreSQL...' + `Host: ${process.env.DATABASE_HOST}, User: ${process.env.POSTGRES_USER}, Database: ${process.env.POSTGRES_DB}`);
    await pool.connect();

    await pool.query('SELECT 1');
    
    console.log('✅ PostgreSQL connected');
    
  } catch (err) {
    console.error('❌ PostgreSQL connection failed:', err.message);
    process.exit(1);
  }
};

// 4. Export both so you can use them elsewhere
export { pool, connectDB };
export default connectDB;