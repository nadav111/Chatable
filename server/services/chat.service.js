import jwt from "jsonwebtoken";
import Chat from "../models/chat.js";

const getChats = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  return Chat.find({ participants: decoded.id });
};

export { getChats };