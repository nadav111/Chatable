import { postData, getData, deleteData } from './apiClient.js';

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
    return getData('/messages/load', {
        'Authorization': `Bearer ${token}`,
        'chat-id': chatId
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

const getUserProfile = async (token) => {
    return getData('/home/profile', {
        'Authorization': `Bearer ${token}`
    });
};

const sendFriendRequest = async (token, username) => {
    return postData('/friends/request', { username }, {
        'Authorization': `Bearer ${token}`
    });
};

const getFriendRequests = async (token) => {
    return getData('/friends/requests', {
        'Authorization': `Bearer ${token}`
    });
};

const respondToFriendRequest = async (token, friendId, action) => {
    return postData('/friends/respond', { friendId, action }, {
        'Authorization': `Bearer ${token}`
    });
};

const getFriends = async (token) => {
    return getData('/friends', {
        'Authorization': `Bearer ${token}`
    });
};

const removeFriend = async (token, friendId) => {
    return deleteData(`/friends/${friendId}`, {
        'Authorization': `Bearer ${token}`
    });
};

const searchUsers = async (token, query) => {
    return getData(`/friends/search?q=${encodeURIComponent(query)}`, {
        'Authorization': `Bearer ${token}`
    });
};

export { login, register, sendMessage, getMessages, getChats, createChat, getUserProfile, sendFriendRequest, getFriendRequests, respondToFriendRequest, getFriends, removeFriend, searchUsers };