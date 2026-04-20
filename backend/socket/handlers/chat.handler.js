export const handleJoinChat = (socket, chatId) => {
  socket.join(`chat_${chatId}`);
};

export const handleLeaveChat = (socket, chatId) => {
  socket.leave(`chat_${chatId}`);
};