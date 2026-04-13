-- Users table
CREATE TABLE IF NOT EXISTS "Users" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chats table
CREATE TABLE IF NOT EXISTS "Chats" (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ChatParticipants table
CREATE TABLE IF NOT EXISTS "ChatParticipants" (
    id SERIAL PRIMARY KEY,
    "chatId" INTEGER NOT NULL REFERENCES "Chats"(id) ON DELETE CASCADE,
    "userId" INTEGER NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
    UNIQUE("chatId", "userId")
);

-- Messages table
CREATE TABLE IF NOT EXISTS "Messages" (
    id SERIAL PRIMARY KEY,
    "chatId" INTEGER NOT NULL REFERENCES "Chats"(id) ON DELETE CASCADE,
    sender INTEGER NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries by chat and creation time
CREATE INDEX IF NOT EXISTS idx_messages_chat_created 
ON "Messages"("chatId", "createdAt");

-- Friends table for friend relationships
CREATE TABLE IF NOT EXISTS "Friends" (
    id SERIAL PRIMARY KEY,
    "requesterId" INTEGER NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
    "addresseeId" INTEGER NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, accepted, blocked
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("requesterId", "addresseeId")
);

-- Index for faster friend queries
CREATE INDEX IF NOT EXISTS idx_friends_requester ON "Friends"("requesterId");
CREATE INDEX IF NOT EXISTS idx_friends_addressee ON "Friends"("addresseeId");
CREATE INDEX IF NOT EXISTS idx_friends_status ON "Friends"(status);