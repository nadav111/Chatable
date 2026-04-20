import { sendMessage } from "../../services/messages.service.js";

export const handleSendMessage = async (io, socket, { token, chatId, content }) => {
  const message = await sendMessage(token, chatId, content);

  // Emit to all clients in the chat room
  io.to(`chat_${chatId}`).emit("new_message", message);

  return message;
}