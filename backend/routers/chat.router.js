import express from 'express';
import { handleGetChats, handleCreateChat } from '../controllers/chat.controller.js';

const router = express.Router();

router.get('/', handleGetChats);
router.post('/create', handleCreateChat);

export default router;