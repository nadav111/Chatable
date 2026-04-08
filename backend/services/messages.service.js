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
    const { token, chatId } = data;

    let senderId;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        senderId = decoded.id;
    } catch (err) {
        throw new Error('Invalid or expired token');
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
        throw new Error('Chat not found');
    }

    if (!chat.participants.some((p) => p.toString() === senderId)) {
        throw new Error('Unauthorized to view messages in this chat');
    }

    return await Message.find({ chatId }).sort({ createdAt: 1 });
};

export { sendMessage, getMessages };