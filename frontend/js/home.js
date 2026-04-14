import ChatManager from "./managers/ChatManager.js";
import FriendManager from "./managers/FriendManager.js";
import UIManager from "./managers/UIManager.js";
import { state, getUserProfile } from "./utils/state.js";

// Initialize app
document.addEventListener("DOMContentLoaded", async () => {
    if (!state.getToken()) {
        window.location.href = "./login.html";
        return;
    }

    // Load user
    state.currentUser = await getUserProfile(state.getToken());

    console.log("Current user:", state.currentUser + " " + state.currentUser.username);

    document.getElementById("profileUsername").textContent = state.currentUser.username;

    // Setup
    UIManager.setupListeners();
    ChatManager.loadChats();
    FriendManager.refreshBadge();
});