import { getChats, createChat } from "../services/chat.service.js";

const handleGetChats = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const chats = await getChats(token);

    res.status(200).json(chats);

  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

const handleCreateChat = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const { username } = req.body;

    const chat = await createChat(token, username);

    res.status(201).json(chat);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export { handleGetChats, handleCreateChat };