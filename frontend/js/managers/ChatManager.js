import { setCurrentChat, state } from "../utils/state.js";
import { getChats, createChat, loadMessages } from "../../lib/api.js";
import { showError, showSuccess, showWarning } from "../../lib/toast.js";
import socket from "../../lib/socket.js";

class ChatManager {
    constructor() {
        this.setupSocketListeners();
    }
    
    setupSocketListeners() {
        socket.on("new_message", (msg) => {
            if (Number(msg.chatId) !== Number(state.currentChatId)) return;

            const type =
                msg.senderId === state.currentUser?.id ? "sent" : "received";

            this.appendMessage(
                msg.content,
                type,
                msg.senderName
            );
        });
    }

    async loadChats() {
        const chatList = document.getElementById("chat-list");

        try {
            const chats = await getChats(state.getToken());

            if (!chats.length) {
                chatList.innerHTML =
                    "<div class='empty-state'>No groups yet.</div>";
                return;
            }

            chatList.innerHTML = "";

            chats.forEach((chat) => {
                const name = this.getChatName(chat);
                const item = document.createElement("div");
                item.className = "chat-item";
                item.textContent = name;

                item.addEventListener("click", () =>
                    this.selectChat(chat.id, name, item)
                );

                chatList.appendChild(item);
            });
        } catch {
            chatList.innerHTML =
                "<div class='empty-state'>Failed to load groups.</div>";
        }
    }

    getChatName(chat) {
        if (chat.participants.length === 2) {
            return (
                chat.participants.find(
                    (p) => p.id !== state.currentUser.id
                )?.username || "Chat"
            );
        }
        return chat.title || "Group";
    }

    selectChat(chatId, chatName, element) {
        if (!chatId) {
            showWarning("Chat ID is missing.");
            return;
        }

        if (state.currentChatId === chatId) return;

        this.joinChatSocket(chatId);

        this.openChat(chatId, chatName, element);

        this.fetchChatMessages(chatId);
    }

    joinChatSocket(chatId) {
        if (this.currentChatId) {
            socket.emit("leave_chat", this.currentChatId);
        }

        setCurrentChat(chatId);

        if (socket.connected) {
            socket.emit("join_chat", chatId);
        } else {
            socket.once("connect", () => {
                socket.emit("join_chat", chatId);
            });
        }

        this.currentChatId = chatId;
    }

    openChat = (chatId, chatName, element) => {
        document.getElementById("emptyState")?.classList.add("hidden");

        document.getElementById("chatInterface").classList.remove("hidden");
        document.getElementById("chatTitle").textContent = chatName;

        document.querySelectorAll(".chat-item").forEach((el) =>
            el.classList.remove("active")
        );

        element.classList.add("active");
    };

    async fetchChatMessages(chatId) {
        const container = document.getElementById("messages");
        container.innerHTML = "";

        try {
            const messages = await loadMessages(state.getToken(), chatId);

            if (!messages?.length) {
                container.innerHTML =
                    "<div class='empty-state'>No messages yet.</div>";
                return;
            }

            messages.forEach((msg) => {
                const type =
                    msg.senderId === state.currentUser.id ? "sent" : "received";
                this.appendMessage(msg.content, type, msg.senderName);
            });
        } catch {
            container.innerHTML =
                "<div class='empty-state'>Error loading messages.</div>";
        }
    }

    async sendMessage(text) {
        if (!text || !state.currentChatId) {
            if (!state.currentChatId) showWarning("Select a group first.");
            return;
        }

        socket.emit(
            "send_message",
            {
                token: state.getToken(),
                chatId: state.currentChatId,
                content: text,
            },
            (res) => {
                if (!res?.success) showError("Failed to send message.");
            }
        );

        document.getElementById("messageInput").value = "";
    }

    appendMessage(text, type, senderName = "") {
        const container = document.getElementById("messages");
        const msg = document.createElement("div");
        msg.className = `message ${type}`;

        if (type === "received") {
            const sender = document.createElement("span");
            sender.className = "message-sender";
            sender.textContent = senderName;
            msg.appendChild(sender);
        }

        const content = document.createElement("span");
        content.className = "message-text";
        content.textContent = text;
        msg.appendChild(content);

        container.appendChild(msg);
        container.scrollTop = container.scrollHeight;
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

    async openChatInfo() {
        if (!state.currentChatId) return;

        const chats = await getChats(state.getToken());
        const chat = chats.find((c) => c.id === state.currentChatId);
        if (!chat) return;

        document.getElementById("chatInfoTitle").textContent =
            chat.title || "Chat Info";

        const list = document.getElementById("chatParticipantsList");
        list.innerHTML = "";

        chat.participants.forEach((p) => {
            const item = document.createElement("div");
            item.className = "friend-item";

            const info = document.createElement("div");
            info.className = "friend-info";

            const avatar = document.createElement("div");
            avatar.className = "friend-avatar";

            const details = document.createElement("div");
            details.className = "friend-details";

            const name = document.createElement("div");
            name.className = "friend-name";
            name.textContent = p.username;

            details.appendChild(name);

            if (p.id === state.currentUser.id) {
                const status = document.createElement("div");
                status.className = "friend-status";
                status.textContent = "You";
                details.appendChild(status);
            }

            info.appendChild(avatar);
            info.appendChild(details);
            item.appendChild(info);
            list.appendChild(item);
        });

        document.getElementById("chatInfoModal").classList.remove("hidden");
    }
}

export default new ChatManager();