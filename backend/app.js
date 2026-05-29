import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";

import { connectDB } from "./db/db.connection.js";
import homeRouter from "./routers/home.router.js";
import messagesRouter from "./routers/messages.router.js";
import chatRouter from "./routers/chat.router.js";
import friendsRouter from "./routers/friends.router.js";
import metricsRouter from "./routers/metrics.router.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import metricsMiddleware from "./middlewares/metricsMiddleware.js";

import { initSocket } from "./socket/index.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// DB
await connectDB();

app.use(cors());

// Metrics middleware
app.use(metricsMiddleware);

// Middleware
app.use(express.json());

// Routes
app.use("/api/home", homeRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/chats", chatRouter);
app.use("/api/friends", friendsRouter);
app.use("/api/metrics", metricsRouter);

app.use(errorMiddleware);

// HTTP server
const server = http.createServer(app);

// Socket.IO + Redis
await initSocket(server);

// Start server
server.listen(port, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${port}`);
});