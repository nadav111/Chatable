import { getChats, createChat, loadMessages as fetchMessages, sendMessage, state } from "../utils/state.js";
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
                item.addEventListener("click", () => this.selectChat(chat.id, name, item));
                chatList.appendChild(item);
            });
        } catch {
            chatList.innerHTML = "<div class='empty-state'>Failed to load groups.</div>";
        }
    }

    getChatName(chat) {
        if (chat.participants.length === 2) {
            return chat.participants.find((p) => p.id !== state.currentUser.id)?.username || "Chat";
        }

        return chat.title || "Group";
    }

    selectChat(chatId, chatName, element) {
        if (!chatId) {
            showWarning("Chat ID is missing.");
            return;
        } else if (state.currentChatId === chatId) {
            return;
        }

        state.currentChatId = chatId;

        document.getElementById("emptyState").classList.add("hidden");
        document.getElementById("chatInterface").classList.remove("hidden");

        document.getElementById("chatTitle").textContent = chatName;

        document.querySelectorAll(".chat-item").forEach((el) => el.classList.remove("active"));
        element.classList.add("active");

        this.loadMessages(chatId);
    }

    async loadMessages(chatId) {
        const container = document.getElementById("messages");
        container.innerHTML = "";

        try {
            const messages = await fetchMessages(state.getToken(), chatId);

            if (!messages?.length) {
                container.innerHTML = "<div class='empty-state'>No messages yet.</div>";
                return;
            }

            messages.forEach((msg) => {
                const type = msg.senderId === state.currentUser.id ? "sent" : "received";
                this.appendMessage(msg.content, type, msg.senderName);
            });
        } catch {
            container.innerHTML = "<div class='empty-state'>Error loading messages.</div>";
        }
    }

    appendMessage(text, type, senderName = "") {
        const container = document.getElementById("messages");
        const msg = document.createElement("div");
        msg.className = `message ${type}`;
        msg.innerHTML = `
            ${type === "received" ? `<span class="message-sender">${senderName}</span>` : ""}
            <span class="message-text">${text}</span>
        `;
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
            this.appendMessage(text, "sent", state.currentUser.username);
            document.getElementById("messageInput").value = "";
        } catch {
            showError("Failed to send message.");
        }
    }

    async createGroup(participantsUsernames, groupName) {
        if (!participantsUsernames.length) {
            showWarning("Select at least one friend.");

            return;
        }

        if (!groupName) {
            showWarning("Please enter a group name.");
            return;
        }

        try {
            await createChat(state.getToken(), participantsUsernames, groupName);
            showSuccess("Group created!");
            await this.loadChats();
        } catch {
            showError("Failed to create group.");
        }
    }
}

export default new ChatManager();