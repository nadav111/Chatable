import express from 'express';
import { handleRegister, handlerLogin, handleGetUserProfile } from '../controllers/home.controller.js';

const router = express.Router();

router.post('/login', handlerLogin);
router.post('/register', handleRegister);
router.get('/profile', handleGetUserProfile);

export default router;