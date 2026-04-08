import jwt from "jsonwebtoken";
import { pool } from "../db/db.connection.js";

const getChats = async (token) => {
  if (!token) {
    throw new Error("No token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const result = await pool.query(`
      SELECT c.id, c.title, c."createdAt", c."updatedAt",
             json_agg(json_build_object('id', u.id, 'username', u.username, 'email', u.email)) as participants
      FROM "Chats" c
      INNER JOIN "ChatParticipants" cp ON c.id = cp."chatId"
      INNER JOIN "Users" u ON cp."userId" = u.id
      WHERE c.id IN (
        SELECT "chatId" FROM "ChatParticipants" WHERE "userId" = $1
      )
      GROUP BY c.id, c.title, c."createdAt", c."updatedAt"
    `, [decoded.id]);

    return result.rows;
  } catch (err) {
    console.error("Failed to get chats:", err);
    throw new Error("Invalid or expired token");
  }
};

const createChat = async (token, username) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const currentUserId = decoded.id;

  try {
    const otherUserResult = await pool.query(
      'SELECT id FROM "Users" WHERE username = $1',
      [username]
    );

    if (otherUserResult.rows.length === 0) {
      throw new Error("User not found");
    }

    const otherUserId = otherUserResult.rows[0].id;

    if (otherUserId === currentUserId) {
      throw new Error("Cannot create chat with yourself");
    }

    // Check if chat already exists
    const existingChatResult = await pool.query(`
      SELECT c.id FROM "Chats" c
      WHERE c.id IN (
        SELECT "chatId" FROM "ChatParticipants" WHERE "userId" = $1
      )
      AND c.id IN (
        SELECT "chatId" FROM "ChatParticipants" WHERE "userId" = $2
      )
      LIMIT 1
    `, [currentUserId, otherUserId]);

    if (existingChatResult.rows.length > 0) {
      return { id: existingChatResult.rows[0].id };
    }

    // Create new chat
    const otherUserResult2 = await pool.query(
      'SELECT username FROM "Users" WHERE id = $1',
      [otherUserId]
    );

    const chatTitle = `${otherUserResult2.rows[0].username} & You`;

    const chatResult = await pool.query(
      'INSERT INTO "Chats" (title) VALUES ($1) RETURNING id, title',
      [chatTitle]
    );

    const chatId = chatResult.rows[0].id;

    // Add participants
    await pool.query(
      'INSERT INTO "ChatParticipants" ("chatId", "userId") VALUES ($1, $2), ($1, $3)',
      [chatId, currentUserId, otherUserId]
    );

    return { id: chatId, title: chatTitle };
  } catch (err) {
    throw err;
  }
};

export { getChats, createChat };