import { sendMessage, getMessages } from '../services/messages.service.js';

const handleSendMessage = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const message = await sendMessage(token, req.body.message, req.body.chatId);
        res.status(201).json(message);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const handleLoadMessages = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const chatId = req.body.chatId;

        const messages = await getMessages(token, chatId);
        res.status(200).json(messages);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

 export { handleSendMessage, handleLoadMessages };