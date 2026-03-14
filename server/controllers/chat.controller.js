import { getChats } from "../services/chat.service.js";

const handleGetChats = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const chats = await getChats(token);
    console.log("Chats to be sent in response:", chats);

    res.status(200).json(chats);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

const handleAddChat = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const chats = await getChats(token);

    res.status(200).json(chats);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};


export { handleGetChats, handleAddChat };