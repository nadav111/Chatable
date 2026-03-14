import express from 'express';
import { handleGetChats, handleAddChat } from '../controllers/chat.controller.js';

const router = express.Router();

router.get('/', handleGetChats);
router.post('/add', handleAddChat);

export default router;