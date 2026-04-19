import { getChats, createChat } from "../services/chat.service.js";

// Extract token
const getToken = (req) => req.headers.authorization?.split(" ")[1];

// GET CHATS
const handleGetChats = async (req, res, next) => {
  try {
    const token = getToken(req);

    if (!token) {
      const err = new Error("Missing authorization token");
      err.status = 401;
      throw err;
    }

    const chats = await getChats(token);

    res.status(200).json(chats);
  } catch (err) {
    next(err);
  }
};

// CREATE CHAT
const handleCreateChat = async (req, res, next) => {
  try {
    const token = getToken(req);

    if (!token) {
      const err = new Error("Missing authorization token");
      err.status = 401;
      throw err;
    }

    const chat = await createChat(token, req.body.participants, req.body.groupName);

    res.status(201).json(chat);
  } catch (err) {
    next(err);
  }
};

export { handleGetChats, handleCreateChat };