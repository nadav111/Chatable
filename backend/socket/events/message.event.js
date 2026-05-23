import { handleSendMessage } from "../handlers/message.handler.js";
import metricsService from "../../services/metrics.service.js";

export function registerMessageEvents(io, socket) {
  socket.on("send_message", async (data, callback) => {
    try {
      metricsService.recordSocketMessage("send_message");
      const message = await handleSendMessage(io, socket, data);
      callback?.({ success: true, message });
    } catch (err) {
      callback?.({ success: false, error: err.message });
    }
  });
}