export {
    sendMessage,
    getChats,
    createChat,
    getMessages,
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
