export {
    sendMessage,
    getChats,
    createChat,
    loadMessages,
    getUserProfile,
    sendFriendRequest,
    getFriendRequests,
    respondToFriendRequest,
    getFriends,
    removeFriend,
    searchUsers,
} from "../../lib/api.js";

// Shared state
export const state = {
    currentChatId: null,
    currentUser: null,
    getToken: () => localStorage.getItem("userToken"),
};

export const setCurrentChat = (chatId) => {
    state.currentChatId = chatId;
};

export const loadChat = async (chatId) => {
    state.currentChatId = chatId;
    
    return await loadMessages(chatId, state.getToken());
};