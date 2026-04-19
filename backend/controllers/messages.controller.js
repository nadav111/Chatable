import { sendMessage, loadMessages } from '../services/messages.service.js';

// Extract token
const getToken = (req) => req.headers.authorization?.split(' ')[1];

// SEND MESSAGE
const handleSendMessage = async (req, res, next) => {
    try {
        const token = getToken(req);

        const message = await sendMessage(
            token,
            req.body.message,
            req.body.chatId
        );

        res.status(201).json(message);
    } catch (err) {
        next(err);
    }
};

// LOAD MESSAGES
const handleLoadMessages = async (req, res, next) => {
    try {
        const token = getToken(req);

        const chatId = req.headers['chat-id'];

        console.log("Loading messages for chatId:", chatId + " with token:", token);

        const messages = await loadMessages(token, chatId);

        res.status(200).json(messages);
    } catch (err) {
        next(err);
    }
};

export { handleSendMessage, handleLoadMessages };