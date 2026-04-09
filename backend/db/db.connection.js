import pg from 'pg';

const pool = new pg.Pool({
  host: process.env.DATABASE_HOST || 'db-service',
  port: 5432,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB
});

const connectDB = async () => {
  try {
    await pool.query('SELECT 1');
    
    console.log('✅ PostgreSQL connected');
  } catch (err) {
    console.error('❌ PostgreSQL connection failed:', err.message || err);
    process.exit(1);
  }
};

export { pool, connectDB };
export default connectDB;