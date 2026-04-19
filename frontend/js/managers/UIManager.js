import ChatManager from "./ChatManager.js";
import FriendManager from "./FriendManager.js";

class UIManager {
    setupListeners() {
        // Message
        document.getElementById("sendBtn").addEventListener("click", () => {
            const text = document.getElementById("messageInput").value.trim();
            ChatManager.sendMessage(text);
        });
        
        document.getElementById("messageInput").addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const text = e.target.value.trim();
                ChatManager.sendMessage(text);
            }
        });

        // Logout
        document.getElementById("logoutBtn").addEventListener("click", () => {
            localStorage.removeItem("userToken");
            window.location.href = "./login.html";
        });

        // Tabs
        document.getElementById("chatsTab").addEventListener("click", () => this.switchTab("chats"));
        document.getElementById("friendsTab").addEventListener("click", () => this.switchTab("friends"));

        // Friend requests
        document.getElementById("friendRequestsBtn").addEventListener("click", () => FriendManager.loadFriendRequests());
        document.getElementById("closeRequestsModalBtn").addEventListener("click", () => {
            document.getElementById("friendRequestsModal").classList.add("hidden");
        });

        // Group modal
        document.getElementById("add-chat").addEventListener("click", () => this.openGroupModal());
        document.getElementById("closeModalBtn").addEventListener("click", () => this.closeGroupModal());
        document.getElementById("cancelChatBtn").addEventListener("click", () => this.closeGroupModal());
        document.getElementById("createChatBtn").addEventListener("click", async () => {
            const participants = FriendManager.getSelectedFriendsUsernames();
            const groupName = document.getElementById("groupNameInput").value.trim();

            if (!groupName) {
                showWarning("Please enter a group name.");
                return;
            }

            await ChatManager.createGroup(participants, groupName);
            this.closeGroupModal();
        });

        // Friend modal
        document.getElementById("add-friend").addEventListener("click", () => this.openFriendModal());
        document.getElementById("closeFriendModalBtn").addEventListener("click", () => this.closeFriendModal());
        document.getElementById("friendSearchInput").addEventListener("input", (e) => {
            FriendManager.searchUsers(e.target.value.trim());
        });
    }

    switchTab(tab) {
        const isChats = tab === "chats";
        document.getElementById("chatsTab").classList.toggle("active", isChats);
        document.getElementById("friendsTab").classList.toggle("active", !isChats);
        document.getElementById("chat-list").classList.toggle("hidden", !isChats);
        document.getElementById("friends-list").classList.toggle("hidden", isChats);
        document.getElementById("add-chat").classList.toggle("hidden", !isChats);
        document.getElementById("add-friend").classList.toggle("hidden", isChats);

        if (!isChats) FriendManager.loadFriends();
    }

    async openGroupModal() {
        document.getElementById("addChatModal").classList.remove("hidden");
        document.getElementById("groupNameInput").addEventListener("input", 
            () => FriendManager.updateCreateButton()
        );
        await FriendManager.loadFriendsForGroupCreation();
    }

    closeGroupModal() {
        document.getElementById("addChatModal").classList.add("hidden");
        document.getElementById("friendsList").innerHTML = "";
        document.getElementById("groupNameInput").value = "";
    }
    
    openFriendModal() {
        document.getElementById("addFriendModal").classList.remove("hidden");
        document.getElementById("friendSearchInput").focus();
    }

    closeFriendModal() {
        document.getElementById("addFriendModal").classList.add("hidden");
        document.getElementById("friendSearchInput").value = "";
        document.getElementById("searchResults").innerHTML = "";
    }
}

export default new UIManager();
