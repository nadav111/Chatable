import { sendMessage } from "../api/api.js";

document.addEventListener("DOMContentLoaded", () => {
    if (!getUserToken()) {
        console.log("User not logged in, redirecting to login");
        window.location.href = "login.html";
        return;
    }

    attachEventListeners();
    loadInitialMessages();
});

function getUserToken() {
    return localStorage.getItem("userToken");
}

function attachEventListeners() {
    const sendBtn = document.getElementById("sendBtn");
    const messageInput = document.getElementById("messageInput");

    if (!sendBtn || !messageInput) {
        console.error("Send button or message input not found");
        return;
    }

    sendBtn.addEventListener("click", handleSendMessage);

    messageInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleSendMessage();
    });
}

// Create and display a message in the UI
function createUIMessage(text, type) {
    const container = document.getElementById("messages");
    if (!container) return;

    const message = document.createElement("div");
    message.className = `message ${type}`;
    message.textContent = text;

    container.appendChild(message);
    // Scroll to the bottom to show the latest message
    container.scrollTop = container.scrollHeight;
}

// Handle sending a message
async function handleSendMessage() {
    const input = document.getElementById("messageInput");
    const text = input.value.trim();
    const token = getUserToken();

    if (!text || !token) return;

    try {
        await sendMessage(token, text, 1); // Assuming chatId is 1 for simplicity

        createUIMessage(text, "sent");

        input.value = "";

        simulateAutoReply(text);
    } catch (err) {
        console.error("Error sending message:", err);
        alert("Failed to send message. Please try again.");
    }
}

function simulateAutoReply(text) {
    setTimeout(() => {
        createUIMessage(`Auto reply to: ${text}`, "received");
    }, 800);
}

function loadInitialMessages() {
    const initialMessages = [
        { text: "Hey 👋", type: "received" },
        { text: "Hi! How are you?", type: "sent" },
        { text: "I'm working on a project.", type: "received" }
    ];

    initialMessages.forEach((msg) => createUIMessage(msg.text, msg.type));
}