import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/db.connection.js";
import homeRouter from "./routers/home.router.js";
import messagesRouter from "./routers/messages.router.js";
import chatRouter from "./routers/chat.router.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import cors from 'cors';

dotenv.config();
await connectDB();

const app = express();
const port = 3000;

app.use(cors());

// Middleware
app.use(express.json());

// Routes
app.use("/api/home", homeRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/chats", chatRouter);

app.use(errorMiddleware);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});