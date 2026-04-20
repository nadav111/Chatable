import { pool } from '../db/db.connection.js';
import { getUserIdByToken } from './home.service.js';

const searchUsers = async (token, query) => {
  const userId = await getUserIdByToken(token);

  const result = await pool.query(
    'SELECT id, username FROM "Users" WHERE username ILIKE $1 AND id != $2 LIMIT 20',
    [`%${query}%`, userId]
  );
  return result.rows;
};

const sendFriendRequest = async (token, targetUsername) => {
  const userId = await getUserIdByToken(token);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const userResult = await client.query(
      'SELECT id FROM "Users" WHERE username = $1',
      [targetUsername]
    );

    if (userResult.rows.length === 0) {
      throw new Error('User not found');
    }

    const targetId = userResult.rows[0].id;

    if (userId === targetId) {
      throw new Error('Cannot send friend request to yourself');
    }

    const existingConnection = await client.query(
      'SELECT * FROM "Friends" WHERE ("firstUserId" = $1 AND "secondUserId" = $2) OR ("firstUserId" = $2 AND "secondUserId" = $1)',
      [userId, targetId]
    );

    if (existingConnection.rows.length > 0) {
      throw new Error('Friend request or connection already exists');
    }

    const result = await client.query(
      `INSERT INTO "Friends" ("firstUserId", "secondUserId", "requesterId", status)
       VALUES ($1, $2, $3, 'pending') RETURNING *`,
      [Math.min(userId, targetId), Math.max(userId, targetId), userId]
    );

    await client.query('COMMIT');
    return result.rows[0];
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

const getFriendRequests = async (token) => {
  const userId = await getUserIdByToken(token);

  const result = await pool.query(
    `SELECT
      f.id,
      f."requesterId" AS "senderId",
      u.username,
      u.id AS "userId",
      f.status,
      f."createdAt",
      'received' AS direction
    FROM "Friends" f
    JOIN "Users" u ON f."requesterId" = u.id
    WHERE
      (f."firstUserId" = $1 OR f."secondUserId" = $1)
      AND f."requesterId" != $1
      AND f.status = 'pending'
    ORDER BY f."createdAt" DESC`,
    [userId]
  );

  return result.rows;
};

const respondToFriendRequest = async (token, requestId, action) => {
  const userId = await getUserIdByToken(token);
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Verify the request belongs to the user and is pending
    const requestResult = await client.query(
      `SELECT "firstUserId", "secondUserId" FROM "Friends"
       WHERE id = $1 AND ("firstUserId" = $2 OR "secondUserId" = $2)
       AND "requesterId" != $2 AND status = 'pending' FOR UPDATE`, 
      [requestId, userId]
    );

    if (requestResult.rows.length === 0) throw new Error('Friend request not found');
    const { firstUserId, secondUserId } = requestResult.rows[0];

    if (action === 'accept') {
      // 2. Create the Chat
      const chatRes = await client.query(
        `INSERT INTO "Chats" (type) VALUES ('direct') RETURNING id`
      );
      const chatId = chatRes.rows[0].id;

      // 3. Link Participants
      await client.query(
        `INSERT INTO "ChatParticipants" ("chatId", "userId") VALUES ($1, $2), ($1, $3)`,
        [chatId, firstUserId, secondUserId]
      );

      // 4. Update Friends status AND link the chatId
      await client.query(
        `UPDATE "Friends" SET status = 'accepted', "chatId" = $1, "updatedAt" = CURRENT_TIMESTAMP 
         WHERE id = $2`,
        [chatId, requestId]
      );

      await client.query('COMMIT');
      return { success: true, action, chatId };

    } else if (action === 'decline') {
      await client.query('DELETE FROM "Friends" WHERE id = $1', [requestId]);
      await client.query('COMMIT');
      return { success: true, action };
    }
    
    throw new Error('Invalid action');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const getFriends = async (token) => {
  const userId = await getUserIdByToken(token);

  const result = await pool.query(
    `SELECT 
        u.id AS "friendId", 
        u.username, 
        u.email,
        f."chatId", -- Now directly available from the relationship
        f."updatedAt" AS "friendsSince"
     FROM "Friends" f
     JOIN "Users" u ON (f."firstUserId" = u.id OR f."secondUserId" = u.id)
     WHERE (f."firstUserId" = $1 OR f."secondUserId" = $1)
       AND f.status = 'accepted'
       AND u.id != $1`,
    [userId]
  );
  
  return result.rows;
};

const removeFriend = async (token, friendId) => {
  const userId = await getUserIdByToken(token);

  const friendExists = await pool.query(
    'SELECT 1 FROM "Users" WHERE id = $1',
    [friendId]
  );
  if (friendExists.rows.length === 0) {
    throw new Error('User not found');
  }

  const result = await pool.query(
    `DELETE FROM "Friends"
     WHERE (("firstUserId" = $1 AND "secondUserId" = $2) OR ("firstUserId" = $2 AND "secondUserId" = $1))
       AND status = 'accepted'`,
    [userId, friendId]
  );

  if (result.rowCount === 0) {
    throw new Error('Friend relationship not found');
  }

  return { success: true };
};

export {
  sendFriendRequest,
  getFriendRequests,
  respondToFriendRequest,
  getFriends,
  removeFriend,
  searchUsers,
};
