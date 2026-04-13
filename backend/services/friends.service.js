import { pool } from '../db/db.connection.js';

const sendFriendRequest = async (requesterId, addresseeUsername) => {
  // Get addressee user
  const addresseeResult = await pool.query('SELECT id FROM "Users" WHERE username = $1', [addresseeUsername]);
  if (addresseeResult.rows.length === 0) {
    throw new Error('User not found');
  }
  const addresseeId = addresseeResult.rows[0].id;

  // Check if already friends or request exists
  const existingResult = await pool.query(
    'SELECT status FROM "Friends" WHERE ("requesterId" = $1 AND "addresseeId" = $2) OR ("requesterId" = $2 AND "addresseeId" = $1)',
    [requesterId, addresseeId]
  );

  if (existingResult.rows.length > 0) {
    const status = existingResult.rows[0].status;
    if (status === 'accepted') {
      throw new Error('Already friends');
    } else if (status === 'pending') {
      throw new Error('Friend request already sent');
    }
  }

  // Prevent self-friend request
  if (requesterId === addresseeId) {
    throw new Error('Cannot send friend request to yourself');
  }

  // Create friend request
  const result = await pool.query(
    'INSERT INTO "Friends" ("requesterId", "addresseeId") VALUES ($1, $2) RETURNING *',
    [requesterId, addresseeId]
  );

  return result.rows[0];
};

const getFriendRequests = async (userId) => {
  const result = await pool.query(`
    SELECT f.id, f.status, f."createdAt",
           u.username, u.email,
           CASE WHEN f."requesterId" = $1 THEN 'sent' ELSE 'received' END as direction
    FROM "Friends" f
    JOIN "Users" u ON (CASE WHEN f."requesterId" = $1 THEN f."addresseeId" ELSE f."requesterId" END = u.id)
    WHERE (f."requesterId" = $1 OR f."addresseeId" = $1) AND f.status = 'pending'
    ORDER BY f."createdAt" DESC
  `, [userId]);

  return result.rows;
};

const respondToFriendRequest = async (userId, friendId, action) => {
  // action can be 'accept' or 'decline'
  const status = action === 'accept' ? 'accepted' : 'declined';

  const result = await pool.query(
    'UPDATE "Friends" SET status = $1, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $2 AND "addresseeId" = $3 RETURNING *',
    [status, friendId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error('Friend request not found or not authorized');
  }

  return result.rows[0];
};

const getFriends = async (userId) => {
  const result = await pool.query(`
    SELECT u.id, u.username, u.email,
           f."createdAt" as friends_since,
           CASE WHEN u.id = f."requesterId" THEN f."addresseeId" ELSE f."requesterId" END as friend_id
    FROM "Friends" f
    JOIN "Users" u ON (CASE WHEN f."requesterId" = $1 THEN f."addresseeId" ELSE f."requesterId" END = u.id)
    WHERE (f."requesterId" = $1 OR f."addresseeId" = $1) AND f.status = 'accepted'
    ORDER BY u.username
  `, [userId]);

  return result.rows;
};

const removeFriend = async (userId, friendId) => {
  const result = await pool.query(
    'DELETE FROM "Friends" WHERE ((requesterId = $1 AND addresseeId = $2) OR (requesterId = $2 AND addresseeId = $1)) AND status = \'accepted\'',
    [userId, friendId]
  );

  if (result.rowCount === 0) {
    throw new Error('Friend relationship not found');
  }

  return { message: 'Friend removed successfully' };
};

const searchUsers = async (query, currentUserId) => {
  const result = await pool.query(`
    SELECT id, username, email FROM "Users"
    WHERE username ILIKE $1 AND id != $2
    LIMIT 10
  `, [`%${query}%`, currentUserId]);

  return result.rows;
};

export { sendFriendRequest, getFriendRequests, respondToFriendRequest, getFriends, removeFriend, searchUsers };