import Message from '../models/message.js';
import jwt from 'jsonwebtoken';
import Chat from '../models/chat.js';

const sendMessage = async (data) => {
  const { token, message, chatId } = data;

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const senderId = decoded.id;

  // Fetch chat and validate sender is a participant
  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw new Error('Chat not found');
  }
  if (!chat.participants.some(p => p.toString() === senderId)) {
    throw new Error('Unauthorized to send message in this chat');
  }

  const newMessage = await Message.create({
    chatId,
    sender: senderId,
    content: message
  });

  return { success: true, message: newMessage };
};

const getMessage = async (data) => {
  // TODO: implement get messages
  return { messages: [] };
};

export { sendMessage, getMessage };