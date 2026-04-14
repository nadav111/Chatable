import { getChats, createChat } from "../services/chat.service.js";

const handleGetChats = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: 'Missing authorization token' });
    }

    const chats = await getChats(token);

    res.status(200).json(chats);

  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

const handleCreateChat = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: 'Missing authorization token' });
    }

    const chat = await createChat(token, req.body.participants);

    res.status(201).json(chat);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export { handleGetChats, handleCreateChat };