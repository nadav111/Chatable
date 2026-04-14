import { pool } from "../db/db.connection.js";
import { getUserIdByToken } from "./home.service.js";

const getChats = async (token) => {
  const userId = await getUserIdByToken(token);

  try {
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
    `, [userId]);

    return result.rows;
  } catch (err) {
    console.error("Failed to get chats:", err);
    throw new Error("Invalid or expired token");
  }
};

const createChat = async (token, participantsUsernames) => {
  const userId = await getUserIdByToken(token);

  if (!participantsUsernames || !Array.isArray(participantsUsernames) || participantsUsernames.length === 0) {
    throw new Error("Participants must be a non-empty array of usernames");
  }

  try {   
    let participantsId = getParticipantIdsByUsernames(userId, participantsUsernames);

    if (participantsId.length === 0) {
      throw new Error("No valid participants provided");
    } else if (participantsId.length === 1) {
      const existingChat = await isDirectChatExists(userId, participantsId[0]);
      
      if (existingChat) {
        return existingChat;
      } else {
        return await createDirectChat(userId, participantsId[0]);
      }
    }

    participantsId.push(userId);
    
    return await createGroupChat(participantsId);
  } catch (err) {
    console.error("Failed to create chat:", err);
    throw err;
  }
};

const getParticipantIdsByUsernames = async (userId, participantUsernames) => {
  let participantIds = [];

  for (const username of participantUsernames) {
    const user = await pool.query(
    'SELECT id FROM "Users" WHERE username = $1',
    [username]);

      if (user.rows.length === 0) {
      throw new Error("User not found");
    }

    const participantId = user.rows[0].id;
    
    if (userId === participantId) {
      throw new Error("Cannot create chat with yourself");
    }

    participantIds.push(participantId);
  }

  return participantIds;
};

const isDirectChatExists = async (userId1, userId2) => {
  const [u1, u2] =
    userId1 < userId2 ? [userId1, userId2] : [userId2, userId1];

  const result = await pool.query(
    `
    SELECT c.id
    FROM "Chats" c
    JOIN "ChatParticipants" cp1 ON cp1."chatId" = c.id
    JOIN "ChatParticipants" cp2 ON cp2."chatId" = c.id
    WHERE c.type = 'direct'
      AND cp1."userId" = $1
      AND cp2."userId" = $2
    LIMIT 1
    `,
    [u1, u2]
  );

  return result.rows[0] ? { id: result.rows[0].id } : null;
};

const createDirectChat = async (userId1, userId2) => {
  const [u1, u2] =
    userId1 < userId2 ? [userId1, userId2] : [userId2, userId1];

  // Create chat
  const chatResult = await pool.query(
    `
    INSERT INTO "Chats" (type)
    VALUES ('direct')
    RETURNING id
    `
  );

  const chatId = chatResult.rows[0].id;

  // Add participants
  await pool.query(
    `
    INSERT INTO "ChatParticipants" ("chatId", "userId")
    VALUES ($1, $2), ($1, $3)
    `,
    [chatId, u1, u2]
  );

  return { id: chatId };
};

const createGroupChat = async (participantIds) => {
  const chatResult = await pool.query(
    'INSERT INTO "Chats" (type) VALUES ($1) RETURNING id',
    ['group']
  );
  const chatId = chatResult.rows[0].id;

  // Add participants
  const values = participantIds.map((id, index) => `($1, $${index + 2})`).join(', ');

  const addParticipantsToChat = await pool.query(
    `INSERT INTO "ChatParticipants" ("chatId", "userId") VALUES ${values}`,
    [chatId, ...participantIds]
  );

  return { id: chatId };
};

export { getChats, createChat }