import { postData, getData } from './apiClient.js';

const login = async (username, password) => {
    return postData('/home/login', { username, password });
};

const register = async (username, email, password) => {
    return postData('/home/register', { username, email, password });
};

const sendMessage = async (token, message, chatId) => {
    console.log("Sending message:", { token, message, chatId });
    
    return postData('/messages/send', { token, message, chatId });
};

const getChats = async (token) => {
    console.log("Fetching chats with token:", token);
    
    return getData('/chats', { token });
}

export { login, register, sendMessage, getChats };