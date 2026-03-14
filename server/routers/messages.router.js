import express from 'express';
import { handlerSendMessage } from '../controllers/messages.controller.js';

const router = express.Router();

router.post('/send', handlerSendMessage);
// router.post('/get', handleRegister);

export default router;