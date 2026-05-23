import { registerMessageEvents } from "./message.event.js";
import { registerChatEvents } from "./chat.event.js";
import { registerPresenceHandlers } from "../handlers/presence.handler.js";
import jwt from "jsonwebtoken";
import metricsService from "../../services/metrics.service.js";

export const registerConnectionEvents = (io) => {
  io.on("connection", (socket) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return socket.disconnect();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.data.userId = decoded.id;

      // Record socket connection
      metricsService.recordSocketConnection();

      registerMessageEvents(io, socket);
      registerChatEvents(io, socket);
      registerPresenceHandlers(io, socket);

      // Handle disconnection
      socket.on("disconnect", () => {
        metricsService.recordSocketDisconnection();
      });
    } catch (err) {
      return socket.disconnect();
    }
  });
};