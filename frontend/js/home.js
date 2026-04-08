import { sendMessage, getChats, createChat, getMessages, getUserByToken } from "../api/api.js";

let currentChatId = null;
let currentUser = null;

document.addEventListener("DOMContentLoaded", async () => {
    const token = getUserToken();
    if (!token) return;

    currentUser = await getUserByToken(token);

    updateProfile();
    addEventListeners();
    loadChatsToSidebar();
});

const addEventListeners = () => {
    const sendBtn = document.getElementById("sendBtn");
    const messageInput = document.getElementById("messageInput");

    sendBtn.addEventListener("click", handleSendMessage);

    addChatModal();

    messageInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleSendMessage();
    });
};

const updateProfile = () => {
    if (!currentUser) return;

    document.getElementById("profileUsername").textContent = currentUser.username;
};

const addChatModal = () => {
    const addChatBtn = document.getElementById("add-chat");
    const modal = document.getElementById("addChatModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const createChatBtn = document.getElementById("createChatBtn");

    addChatBtn.addEventListener("click", () => {
        modal.classList.remove("hidden");
    });

    closeModalBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    createChatBtn.addEventListener("click", async () => {
        const username = document.getElementById("chatUserInput").value.trim();

        if (!username) {
            alert("Please enter a username.");
            return;
        }

        try {
            await createChat(getUserToken(), username);
            modal.classList.add("hidden");
            document.getElementById("chatUserInput").value = "";
            loadChatsToSidebar();
        } catch (err) {
            console.error("Error creating chat:", err);
            alert("Failed to create chat. Please try again.");
        }
    });
};

const getUserToken = () => {
    const token = localStorage.getItem("userToken");

    if (!token) {
        window.location.href = "login.html";
        return null;
    }

    return token;
};

const getUserChats = async () => {
    const token = getUserToken();
    if (!token) return [];

    try {
        return await getChats(token);
    } catch (err) {
        console.error("Error fetching chats:", err);
        alert("Failed to load chats. Please try again.");
        return [];
    }
};

const handleSendMessage = async () => {
    const input = document.getElementById("messageInput");
    const text = input.value.trim();
    const token = getUserToken();

    if (!text || !token) return;

    if (!currentChatId) {
        alert("Please select a chat first.");
        return;
    }

    try {
        await sendMessage(token, text, currentChatId);
        createUIMessage(text, "sent");
        input.value = "";
    } catch (err) {
        console.error("Error sending message:", err);
        alert("Failed to send message. Please try again.");
    }
};

const loadMessagesForChat = async (chatId) => {
    const token = getUserToken();

    if (!token || !chatId) return;

    const container = document.getElementById("messages");
    if (!container) return;

    container.innerHTML = "";

    try {
        const messages = await getMessages(token, chatId);

        if (!messages || messages.length === 0) {
            const empty = document.createElement("div");
            empty.className = "empty-state";
            empty.textContent = "No messages yet. Say hello!";
            container.appendChild(empty);
            return;
        }

        messages.forEach((msg) => {
            const senderId = msg.sender?._id;
            const type = senderId === (currentUser._id) ? "sent" : "received";
            createUIMessage(msg.text || msg.content, type);
        });
    } catch (err) {
        console.error("Error loading messages:", err);
        alert("Failed to load messages. Please try again.");
    }
};

const createUIMessage = (text, type) => {
    const container = document.getElementById("messages");
    if (!container) return;

    const message = document.createElement("div");
    message.className = `message ${type}`;
    message.textContent = text;

    container.appendChild(message);
    container.scrollTop = container.scrollHeight;
};

const loadChatsToSidebar = async () => {
    const chats = await getUserChats();
    const chatList = document.getElementById("chat-list");

    if (!chats || chats.length === 0) {
        chatList.innerHTML = "<div class='empty-state'>No chats yet.</div>";
        return;
    }

    chatList.innerHTML = "";

    chats.forEach((chat) => {
        const chatElement = document.createElement("div");
        chatElement.className = "chat-item";

        if (chat.participants.length === 2) {
            const otherUser = chat.participants.find(
                (p) => (p._id) !== (currentUser._id)
            );
            chatElement.textContent = otherUser?.username || "Chat";
        } else {
            chatElement.textContent = chat.title || "Chat";
        }

        chatElement.addEventListener("click", () => {
            currentChatId = chat._id;
            loadMessagesForChat(currentChatId);

            const chatHeader = document.querySelector(".chat-header");

            chatHeader.textContent = chatElement.textContent;

            document
                .querySelectorAll(".chat-item")
                .forEach((el) => el.classList.remove("active"));
            chatElement.classList.add("active");
        });

        chatList.appendChild(chatElement);
    });
};