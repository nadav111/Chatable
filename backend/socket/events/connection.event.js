import { registerMessageEvents } from "./message.event.js";
import { registerChatEvents } from "./chat.event.js";
import { registerPresenceHandlers } from "../handlers/presence.handler.js";
import jwt from "jsonwebtoken";

export const registerConnectionEvents = (io) => {
  io.on("connection", (socket) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return socket.disconnect();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.data.userId = decoded.id;

      registerMessageEvents(io, socket);
      registerChatEvents(io, socket);
      registerPresenceHandlers(io, socket);
    } catch (err) {
      return socket.disconnect();
    }
  });
};