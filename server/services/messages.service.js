import Message from '../models/message.js';
import jwt from 'jsonwebtoken';
import Chat from '../models/chat.js';

const sendMessage = async (data) => {
  const { token, message, chatId } = data;

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const senderId = decoded.id;

  const chat = await Chat.findById(chatId);

  if (!chat) {
    throw new Error('Chat not found');
  }
  
  if (!chat.participants.some(p => p.toString() === senderId)) {
    throw new Error('Unauthorized to send message in this chat');
  }

  await Message.create({
    chatId,
    sender: senderId,
    content: message
  });
};

const getMessages = async (data) => {
  // TODO: implement get messages
  return { messages: [] };
};

export { sendMessage, getMessages };