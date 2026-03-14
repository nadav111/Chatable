import jwt from "jsonwebtoken";
import Chat from "../models/chat.js";
import User from "../models/user.js";

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

const createChat = async (token, username) => {
  console.log("Creating chat with username:", username);

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const currentUserId = decoded.id;

  const otherUser = await User.findOne({ username });

  console.log("Creating chat - current user ID:", currentUserId);
  console.log("Creating chat - other user found:", otherUser);

  if (!otherUser) {
    throw new Error("User not found");
  }

  if (otherUser._id.toString() === currentUserId) {
    throw new Error("Cannot create chat with yourself");
  }

  const existingChat = await Chat.findOne({
    participants: { $all: [currentUserId, otherUser._id] }
  });

  if (existingChat) {
    return existingChat;
  }

  const chat = await Chat.create({
    title: `${otherUser.username} & You`,
    participants: [currentUserId, otherUser._id]
  });

  console.log("Created new chat:", chat);

  return chat;
};

export { getChats, createChat };