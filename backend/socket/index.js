import { Server } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import { registerConnectionEvents } from "./events/connection.event.js";

export const initSocket = async (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  try {
    const pubClient = createClient({ url: process.env.REDIS_URL });
    const subClient = pubClient.duplicate();

    await pubClient.connect();
    await subClient.connect();

    io.adapter(createAdapter(pubClient, subClient));

    console.log("✅ Socket.IO + Redis connected");
  } catch (err) {
    console.warn("⚠️ Redis not available - running without cluster mode");
    console.error("❌ Redis connection failed:", err.message);
  }

  registerConnectionEvents(io);

  return io;
}