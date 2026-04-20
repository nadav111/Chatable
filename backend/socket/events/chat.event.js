export const registerChatEvents = (io, socket) => {
  socket.on("join_chat", (chatId) => {
    socket.join(`chat_${chatId}`);
  });

  socket.on("leave_chat", (chatId) => {
    socket.leave(`chat_${chatId}`);
  });
}