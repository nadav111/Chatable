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

  const userResult = await pool.query(
    'SELECT id FROM "Users" WHERE username = $1',
    [targetUsername]
  );

  if (userResult.rows.length === 0) {
    throw new Error('User not found');
  }

  const receiverId = userResult.rows[0].id;

  if (userId === receiverId) {
    throw new Error('Cannot send friend request to yourself');
  }

  const existingConnection = await pool.query(
    'SELECT * FROM "Friends" WHERE ("firstUserId" = $1 AND "secondUserId" = $2) OR ("firstUserId" = $2 AND "secondUserId" = $1)',
    [userId, receiverId]
  );

  if (existingConnection.rows.length > 0) {
    throw new Error('Friend request or connection already exists');
  }

  const result = await pool.query(
    'INSERT INTO "Friends" ("firstUserId", "secondUserId", status) VALUES ($1, $2, \'pending\') RETURNING *',
    [Math.min(userId, receiverId), Math.max(userId, receiverId)]
  );

  return result.rows[0];
};

const getFriendRequests = async (token) => {
  const userId = await getUserIdByToken(token);

  const result = await pool.query(
    'SELECT f.id, f."firstUserId" as "senderId", u.username, u.id as "userId", f.status, f."createdAt", \'received\' as direction FROM "Friends" f JOIN "Users" u ON f."firstUserId" = u.id WHERE f."secondUserId" = $1 AND f.status = \'pending\' ORDER BY f."createdAt" DESC',
    [userId]
  );

  return result.rows;
};

const respondToFriendRequest = async (token, requestId, action) => {
  const userId = await getUserIdByToken(token);

  const requestResult = await pool.query(
    'SELECT * FROM "Friends" WHERE id = $1 AND "secondUserId" = $2 AND status = \'pending\'',
    [requestId, userId]
  );

  if (requestResult.rows.length === 0) {
    throw new Error('Friend request not found');
  }

  if (action === 'accept') {
    await pool.query(
      'UPDATE "Friends" SET status = \'accepted\', "updatedAt" = CURRENT_TIMESTAMP WHERE id = $1',
      [requestId]
    );
  } else if (action === 'decline') {
    await pool.query(
      'DELETE FROM "Friends" WHERE id = $1',
      [requestId]
    );
  }

  return { success: true, action };
};

const getFriends = async (token) => {
  const userId = await getUserIdByToken(token);

  const result = await pool.query(
    'SELECT u.id, u.username FROM "Friends" f JOIN "Users" u ON (f."firstUserId" = u.id OR f."secondUserId" = u.id) WHERE (f."firstUserId" = $1 OR f."secondUserId" = $1) AND f.status = \'accepted\' AND u.id != $1',
    [userId]
  );
  return result.rows;
};

const removeFriend = async (token, friendId) => {
  const userId = await getUserIdByToken(token);
  
  const result = await pool.query(
    'DELETE FROM "Friends" WHERE ((("firstUserId" = $1 AND "secondUserId" = $2) OR ("firstUserId" = $2 AND "secondUserId" = $1)) AND status = \'accepted\')',
    [userId, friendId]
  );

  if (result.rowCount === 0) {
    throw new Error('Friend relationship not found');
  }

  return { success: true };
};

export { sendFriendRequest, getFriendRequests, respondToFriendRequest, getFriends, removeFriend, searchUsers };
