-- Users: stores account credentials
CREATE TABLE IF NOT EXISTS "Users" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chats: stores all chats (direct or group)
CREATE TABLE IF NOT EXISTS "Chats" (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('direct', 'group')),
    title VARCHAR(255),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ChatParticipants: which users are in which chat
CREATE TABLE IF NOT EXISTS "ChatParticipants" (
    id SERIAL PRIMARY KEY,
    "chatId" INTEGER REFERENCES "Chats"(id) ON DELETE CASCADE,
    "userId" INTEGER REFERENCES "Users"(id) ON DELETE CASCADE
);

-- Messages: chat messages
CREATE TABLE IF NOT EXISTS "Messages" (
    id SERIAL PRIMARY KEY,
    "chatId" INTEGER REFERENCES "Chats"(id) ON DELETE CASCADE,
    "senderId" INTEGER REFERENCES "Users"(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Friends: friend relationships
CREATE TABLE IF NOT EXISTS "Friends" (
    id SERIAL PRIMARY KEY,
    "user1" INTEGER REFERENCES "Users"(id) ON DELETE CASCADE,
    "user2" INTEGER REFERENCES "Users"(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);