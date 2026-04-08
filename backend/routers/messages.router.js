import express from 'express';
import { handleSendMessage, handleLoadMessages } from '../controllers/messages.controller.js';

const router = express.Router();

router.post('/send', handleSendMessage);
router.get('/load', handleLoadMessages);

export default router;