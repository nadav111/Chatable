import { sendMessage, getChats, createChat } from "../api/api.js";

let currentChatId = null;

document.addEventListener("DOMContentLoaded", () => {
    getUserToken(); // Ensure user is logged in before doing anything else

    addEventListeners();

    loadChatsToSidebar();
    loadInitialMessages();
});

const addEventListeners = () => {
    const sendBtn = document.getElementById("sendBtn");
    const messageInput = document.getElementById("messageInput");

    sendBtn.addEventListener("click", handleSendMessage);

    addChatModal();

    messageInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleSendMessage();
    });
}

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
        const username = document.getElementById("chatUserInput").value;

        // TODO:
        await createChat(getUserToken(), username);

        console.log("Creating chat with:", username);

        modal.classList.add("hidden");
})};

// -- USER --
const getUserToken = () => {
    const token = localStorage.getItem("userToken");

    if (!token) {
        console.log("User not logged in, redirecting to login");
        window.location.href = "login.html";
        return;
    }

    return token;
}

const getUserChats = async () => {
    const token = getUserToken();

    try {
        const response = await getChats(token);
        console.log("Raw response from getChats:", response);
        
        return response;
    } catch (err) {
        console.error("Error fetching chats:", err);
        alert("Failed to load chats. Please try again.");
    }
};


// Handle sending a message
const handleSendMessage = async () => {
    const input = document.getElementById("messageInput");
    const text = input.value.trim();
    const token = getUserToken();

    if (!text || !token) return;

    if (!currentChatId) {
        alert("Please select a chat first");
        return;
    }

    try {
        console.log("Sending message: " + text + " with token: " + token + " to chatId: " + currentChatId);

        await sendMessage(token, text, currentChatId);

        createUIMessage(text, "sent");

        input.value = "";

        simulateAutoReply(text);
    } catch (err) {
        console.error("Error sending message:", err);
        alert("Failed to send message. Please try again.");
    }
}

// -- END USER --

// -- UI --
const createUIMessage = (text, type) => {
    const container = document.getElementById("messages");
    if (!container) return;

    const message = document.createElement("div");
    message.className = `message ${type}`;
    message.textContent = text;

    container.appendChild(message);
    // Scroll to the bottom to show the latest message
    container.scrollTop = container.scrollHeight;
}

const simulateAutoReply = (text) => {
    setTimeout(() => {
        createUIMessage(`Auto reply to: ${text}`, "received");
    }, 800);
}

const loadInitialMessages = async () => {
    const initialMessages = [
        { text: "Hey 👋", type: "received" },
        { text: "Hi! How are you?", type: "sent" },
        { text: "I'm working on a project.", type: "received" }
    ];

    initialMessages.forEach((msg) => createUIMessage(msg.text, msg.type));
}

const loadChatsToSidebar = async () => {
    const chats = await getUserChats();
    console.log("Chats loaded for sidebar:", chats);

    const chatList = document.getElementById("chat-list");

    chatList.innerHTML = "";

    chats.forEach((chat) => {
        const chatElement = document.createElement("div");
        chatElement.className = "chat-item";
        chatElement.textContent = chat.title;

        console.log("Adding chat to sidebar:", chat);

        chatElement.addEventListener("click", () => {
            currentChatId = chat.id;
            console.log("Selected chat:", currentChatId);
        });

        chatList.appendChild(chatElement);
    });
};

// -- END UI --