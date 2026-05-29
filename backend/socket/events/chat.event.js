import metricsService from "../../services/metrics.service.js";

export const registerChatEvents = (io, socket) => {
  socket.on("join_chat", (chatId) => {
    metricsService.recordSocketMessage("join_chat");
    socket.join(`chat_${chatId}`);
  });

  socket.on("leave_chat", (chatId) => {
    metricsService.recordSocketMessage("leave_chat");
    socket.leave(`chat_${chatId}`);
  });
}