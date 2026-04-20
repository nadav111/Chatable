import jwt from 'jsonwebtoken';
import { pool } from '../db/db.connection.js';
import { getUserIdByToken } from './home.service.js';

const sendMessage = async (token, chatId, content) => {
  const senderId = await getUserIdByToken(token);

  const chatResult = await pool.query(
    'SELECT id FROM "Chats" WHERE id = $1',
    [chatId]
  );

  if (chatResult.rows.length === 0) {
    throw new Error('Chat not found');
  }

  const participantResult = await pool.query(
    'SELECT id FROM "ChatParticipants" WHERE "chatId" = $1 AND "userId" = $2',
    [chatId, senderId]
  );

  if (participantResult.rows.length === 0) {
    throw new Error('Unauthorized to send message in this chat');
  }

  const result = await pool.query(
    `INSERT INTO "Messages" ("chatId", "senderId", content)
     VALUES ($1, $2, $3)
     RETURNING id, "chatId", "senderId", content, "createdAt"`,
    [chatId, senderId, content]
  );

  const message = result.rows[0];

  const user = await pool.query(
    'SELECT username FROM "Users" WHERE id = $1',
    [senderId]
  );

  message.senderName = user.rows[0].username;

  return message;
};

const loadMessages = async (token, chatId, limit = 50) => {
  const userId = await getUserIdByToken(token);

  const query = `
    SELECT * FROM (
        SELECT 
          m.id, 
          m."chatId", 
          m."senderId", 
          u.username AS "senderName",
          m.content, 
          m."createdAt"
        FROM "Messages" m
        JOIN "Users" u ON m."senderId" = u.id
        WHERE m."chatId" = $1 
          AND EXISTS (
            SELECT 1 FROM "ChatParticipants" 
            WHERE "chatId" = $1 AND "userId" = $2
          )
        ORDER BY m."createdAt" DESC -- Grab the LATEST 50 quickly
        LIMIT $3
    ) AS latest_msgs
    ORDER BY "createdAt" ASC;
  `;

  const result = await pool.query(query, [chatId, userId, limit]);
  return result.rows; 
};

export { sendMessage, loadMessages };