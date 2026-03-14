import jwt from "jsonwebtoken";
import Chat from "../models/chat.js";

const getChats = async (token) => {
  if (!token) {
    throw new Error("No token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded user ID:", decoded.id);

    const chats = await Chat.find({ participants: decoded.id })
      .populate("participants", "username email");
      
    console.log("Chats found for user:", chats);

    return chats;
  } catch (err) {
    console.error("Failed to get chats:", err);
    throw new Error("Invalid or expired token");
  }
};

export { getChats };