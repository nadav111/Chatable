import { postData, getData } from './apiClient.js';

const login = async (username, password) => {
    return postData('/home/login', { username, password });
};

const register = async (username, email, password) => {
    return postData('/home/register', { username, email, password });
};

const sendMessage = async (token, message, chatId) => {
    return postData('/messages/send', { message, chatId }, { 
        'Authorization': `Bearer ${token}` 
    });
};

const getMessages = async (token, chatId) => {
    return getData(`/messages/${chatId}`, {
        'Authorization': `Bearer ${token}`
    });
};

const getChats = async (token) => {
    return getData('/chats', { 
        'Authorization': `Bearer ${token}` 
    });
};

const createChat = async (token, username) => {
    return postData('/chats/create', { username }, {
        'Authorization': `Bearer ${token}` 
    });
};

const getUserByToken = async (token) => {
    return getData('/home/profile', {
        'Authorization': `Bearer ${token}`
    });
}

export { login, register, sendMessage, getMessages, getChats, createChat, getUserByToken };