import jwt from 'jsonwebtoken';
import { pool } from '../db/db.connection.js';

const sendMessage = async (data) => {
  const { token, message, chatId } = data;

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const senderId = decoded.id;

  try {
    // Check if chat exists
    const chatResult = await pool.query(
      'SELECT id FROM "Chats" WHERE id = $1',
      [chatId]
    );

    if (chatResult.rows.length === 0) {
      throw new Error('Chat not found');
    }

    // Check if user is participant
    const participantResult = await pool.query(
      'SELECT id FROM "ChatParticipants" WHERE "chatId" = $1 AND "userId" = $2',
      [chatId, senderId]
    );

    if (participantResult.rows.length === 0) {
      throw new Error('Unauthorized to send message in this chat');
    }

    // Insert message
    await pool.query(
      'INSERT INTO "Messages" ("chatId", sender, content) VALUES ($1, $2, $3)',
      [chatId, senderId, message]
    );
  } catch (err) {
    throw err;
  }
};

const getMessages = async (data) => {
  const { token, chatId } = data;

  let senderId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    senderId = decoded.id;
  } catch (err) {
    throw new Error('Invalid or expired token');
  }

  try {
    // Check if chat exists
    const chatResult = await pool.query(
      'SELECT id FROM "Chats" WHERE id = $1',
      [chatId]
    );

    if (chatResult.rows.length === 0) {
      throw new Error('Chat not found');
    }

    // Check if user is participant
    const participantResult = await pool.query(
      'SELECT id FROM "ChatParticipants" WHERE "chatId" = $1 AND "userId" = $2',
      [chatId, senderId]
    );

    if (participantResult.rows.length === 0) {
      throw new Error('Unauthorized to view messages in this chat');
    }

    // Get messages
    const messagesResult = await pool.query(
      'SELECT id, "chatId", sender, content, "createdAt", "updatedAt" FROM "Messages" WHERE "chatId" = $1 ORDER BY "createdAt" ASC',
      [chatId]
    );

    return messagesResult.rows;
  } catch (err) {
    throw err;
  }
};

export { sendMessage, getMessages };