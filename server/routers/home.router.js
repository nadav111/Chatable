import express from 'express';
import { handleRegister, handlerLogin } from '../controllers/home.controller.js';

const router = express.Router();

router.post('/login', handlerLogin);
router.post('/register', handleRegister);

export default router;