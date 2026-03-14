import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/db.connection.js";
import homeRouter from "./routers/home.router.js";
import messagesRouter from "./routers/messages.router.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import cors from 'cors';

dotenv.config();
connectDB();

const app = express();
const port = 3000;

app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Middleware
app.use(express.json());

// Routes
app.use("/home", homeRouter);
app.use("/messages", messagesRouter);

app.use(errorMiddleware);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});