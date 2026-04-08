import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://chatable_user:chatable_password@localhost:5432/chatable',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const connectDB = async () => {
  try {
    const client = await pool.connect();
    
    // Create tables if they don't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS "Users" (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "Chats" (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "ChatParticipants" (
        id SERIAL PRIMARY KEY,
        "chatId" INTEGER NOT NULL REFERENCES "Chats"(id) ON DELETE CASCADE,
        "userId" INTEGER NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
        UNIQUE("chatId", "userId")
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "Messages" (
        id SERIAL PRIMARY KEY,
        "chatId" INTEGER NOT NULL REFERENCES "Chats"(id) ON DELETE CASCADE,
        sender INTEGER NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_messages_chat_created ON "Messages"("chatId", "createdAt");
    `);

    client.release();
    console.log('✅ PostgreSQL Connected');
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
    process.exit(1);
  }
};

export { pool, connectDB };
export default connectDB;