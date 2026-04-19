import { pool } from "../db/db.connection.js";
import { getUserIdByToken } from "./home.service.js";

const getChats = async (token) => {
    const userId = await getUserIdByToken(token);

    const result = await pool.query(`
        SELECT c.id, c.title, c.type,
               json_agg(json_build_object('id', u.id, 'username', u.username)) AS participants
        FROM "Chats" c
        JOIN "ChatParticipants" cp ON c.id = cp."chatId"
        JOIN "Users" u ON cp."userId" = u.id
        WHERE c.id IN (
            SELECT "chatId" FROM "ChatParticipants" WHERE "userId" = $1
        )
        GROUP BY c.id, c.title, c.type
    `, [userId]);

    return result.rows;
};

const createChat = async (token, participantUsernames) => {
    const userId = await getUserIdByToken(token);

    if (!Array.isArray(participantUsernames) || participantUsernames.length === 0) {
        throw new Error("Participants must be a non-empty array of usernames");
    }

    const participantIds = await getParticipantIdsByUsernames(userId, participantUsernames);

    if (participantIds.length === 1) {
        const existing = await findDirectChat(userId, participantIds[0]);
        if (existing) return existing;
        return await createDirectChat(userId, participantIds[0]);
    }

    return await createGroupChat([userId, ...participantIds]);
};

const getParticipantIdsByUsernames = async (userId, usernames) => {
    const ids = [];

    for (const username of usernames) {
        const result = await pool.query(
            `SELECT id FROM "Users" WHERE username = $1`,
            [username]
        );

        if (!result.rows.length) throw new Error(`User not found: ${username}`);

        const participantId = result.rows[0].id;
        if (participantId === userId) throw new Error("Cannot create chat with yourself");

        ids.push(participantId);
    }

    return ids;
};

const findDirectChat = async (userId1, userId2) => {
    const [u1, u2] = userId1 < userId2 ? [userId1, userId2] : [userId2, userId1];

    const result = await pool.query(`
        SELECT c.id FROM "Chats" c
        JOIN "ChatParticipants" cp1 ON cp1."chatId" = c.id
        JOIN "ChatParticipants" cp2 ON cp2."chatId" = c.id
        WHERE c.type = 'direct' AND cp1."userId" = $1 AND cp2."userId" = $2
        LIMIT 1
    `, [u1, u2]);

    return result.rows[0] ?? null;
};

const createDirectChat = async (userId1, userId2) => {
    const [u1, u2] = userId1 < userId2 ? [userId1, userId2] : [userId2, userId1];

    const { rows } = await pool.query(
        `INSERT INTO "Chats" (type) VALUES ('direct') RETURNING id`
    );
    const chatId = rows[0].id;

    await pool.query(
        `INSERT INTO "ChatParticipants" ("chatId", "userId") VALUES ($1, $2), ($1, $3)`,
        [chatId, u1, u2]
    );

    return { id: chatId };
};

const createGroupChat = async (participantIds) => {
    const { rows } = await pool.query(
        `INSERT INTO "Chats" (type) VALUES ('group') RETURNING id`
    );
    const chatId = rows[0].id;

    const values = participantIds.map((_, i) => `($1, $${i + 2})`).join(", ");

    await pool.query(
        `INSERT INTO "ChatParticipants" ("chatId", "userId") VALUES ${values}`,
        [chatId, ...participantIds]
    );

    return { id: chatId };
};

export { getChats, createChat };