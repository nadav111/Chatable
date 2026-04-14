import { getChats, createChat, getMessages, sendMessage, state } from "../utils/state.js";
import { showError, showSuccess, showWarning } from "../../lib/toast.js";

class ChatManager {
    async loadChats() {
        const chatList = document.getElementById("chat-list");
        try {
            const chats = await getChats(state.getToken());
            if (!chats.length) {
                chatList.innerHTML = "<div class='empty-state'>No groups yet.</div>";
                return;
            }

            chatList.innerHTML = "";
            chats.forEach((chat) => {
                const name = this.getChatName(chat);
                const item = document.createElement("div");
                item.className = "chat-item";
                item.textContent = name;
                item.addEventListener("click", () => this.selectChat(chat._id, name, item));
                chatList.appendChild(item);
            });
        } catch {
            chatList.innerHTML = "<div class='empty-state'>Failed to load groups.</div>";
        }
    }

    getChatName(chat) {
        if (chat.participants.length === 2) {
            return chat.participants.find((p) => p._id !== state.currentUser._id)?.username || "Chat";
        }
        
        return chat.title || "Group";
    }

    selectChat(chatId, name, element) {
        state.currentChatId = chatId;
        document.querySelector(".chat-header").textContent = name;
        document.querySelectorAll(".chat-item").forEach((el) => el.classList.remove("active"));
        element.classList.add("active");
        this.loadMessages(chatId);
    }

    async loadMessages(chatId) {
        const container = document.getElementById("messages");
        container.innerHTML = "";

        try {
            const messages = await getMessages(state.getToken(), chatId);
            if (!messages?.length) {
                container.innerHTML = "<div class='empty-state'>No messages yet.</div>";
                return;
            }

            messages.forEach((msg) => {
                const type = msg.sender?._id === state.currentUser._id ? "sent" : "received";
                this.appendMessage(msg.text || msg.content, type);
            });
        } catch {
            container.innerHTML = "<div class='empty-state'>Error loading messages.</div>";
        }
    }

    appendMessage(text, type) {
        const container = document.getElementById("messages");
        const msg = document.createElement("div");
        msg.className = `message ${type}`;
        msg.textContent = text;
        container.appendChild(msg);
        container.scrollTop = container.scrollHeight;
    }

    async sendMessage(text) {
        if (!text || !state.currentChatId) {
            if (!state.currentChatId) showWarning("Select a group first.");
            return;
        }

        try {
            await sendMessage(state.getToken(), text, state.currentChatId);
            this.appendMessage(text, "sent");
            document.getElementById("messageInput").value = "";
        } catch {
            showError("Failed to send message.");
        }
    }

    async createGroup(friendIds) {
        if (friendIds.length === 0) {
            showWarning("Select at least one friend.");
            return;
        }

        try {
            for (const friendId of friendIds) {
                await createChat(state.getToken(), friendId);
            }
            showSuccess("Group created!");
            await this.loadChats();
        } catch {
            showError("Failed to create group.");
        }
    }
}

export default new ChatManager();
