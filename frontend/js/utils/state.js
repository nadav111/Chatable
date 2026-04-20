export const state = {
    currentChatId: null,
    currentUser: null,
    getToken: () => localStorage.getItem("userToken"),
};

export const setCurrentChat = (chatId) => {
    state.currentChatId = chatId;
};