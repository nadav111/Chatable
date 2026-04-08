import express from 'express';
import { handleRegister, handlerLogin, getUserProfile } from '../controllers/home.controller.js';

const router = express.Router();

router.post('/login', handlerLogin);
router.post('/register', handleRegister);
router.get('/profile', getUserProfile);

export default router;