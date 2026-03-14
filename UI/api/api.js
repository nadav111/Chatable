import { postData, getData } from './apiClient.js';

const login = async (username, password) => {
    return postData('/home/login', { username, password });
};

const register = async (username, email, password) => {
    return postData('/home/register', { username, email, password });
};

const sendMessage = async (token, message, chatId) => {
    console.log("Sending message:", { token, message, chatId });
    
    return postData('/messages/send', { message, chatId }, { 
        'Authorization': `Bearer ${token}` 
    });
};

const getChats = async (token) => {
    console.log("Fetching chats with token:", token);
    
    return getData('/chats', { 
        'Authorization': `Bearer ${token}` 
    });
};

const createChat = async (token, username) => {
    console.log("Creating chat with username:", username, "and token:", token);

    return postData('/chats/create', { username }, {
        'Authorization': `Bearer ${token}` 
    });
};

export { login, register, sendMessage, getChats, createChat };