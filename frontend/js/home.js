import {
    sendMessage,
    getChats,
    createChat,
    getMessages,
    getUserByToken,
    sendFriendRequest,
    getFriendRequests,
    respondToFriendRequest,
    getFriends,
    removeFriend,
    searchUsers,
} from "../lib/api.js";


// ─── State ────────────────────────────────────────────────────────────────────

let currentChatId = null;
let currentUser = null;

const getToken = () => localStorage.getItem("userToken");


// ─── Boot ─────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", async () => {
    if (!getToken()) {
        window.location.href = "./login.html";
        return;
    }

    currentUser = await getUserByToken(getToken());
    document.getElementById("profileUsername").textContent = currentUser.username;

    setupListeners();
    loadChats();
    refreshBadge();
});


// ─── Listeners ────────────────────────────────────────────────────────────────

function setupListeners() {
    document.getElementById("sendBtn").addEventListener("click", handleSendMessage);
    document.getElementById("messageInput").addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleSendMessage();
    });

    document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("userToken");
        window.location.href = "./login.html";
    });

    document.getElementById("chatsTab").addEventListener("click", () => switchTab("chats"));
    document.getElementById("friendsTab").addEventListener("click", () => switchTab("friends"));

    document.getElementById("friendRequestsBtn").addEventListener("click", openRequestsModal);
    document.getElementById("closeRequestsModalBtn").addEventListener("click", () => {
        document.getElementById("friendRequestsModal").classList.add("hidden");
    });

    document.getElementById("add-chat").addEventListener("click", () => {
        document.getElementById("addChatModal").classList.remove("hidden");
    });
    document.getElementById("closeModalBtn").addEventListener("click", () => {
        document.getElementById("addChatModal").classList.add("hidden");
    });
    document.getElementById("createChatBtn").addEventListener("click", handleCreateChat);

    document.getElementById("add-friend").addEventListener("click", () => {
        document.getElementById("addFriendModal").classList.remove("hidden");
        document.getElementById("friendSearchInput").focus();
    });
    document.getElementById("closeFriendModalBtn").addEventListener("click", () => {
        document.getElementById("addFriendModal").classList.add("hidden");
        document.getElementById("friendSearchInput").value = "";
        document.getElementById("searchResults").innerHTML = "";
    });
    document.getElementById("friendSearchInput").addEventListener("input", (e) => {
        handleUserSearch(e.target.value.trim());
    });
}


// ─── Tabs ─────────────────────────────────────────────────────────────────────

function switchTab(tab) {
    const isChats = tab === "chats";

    document.getElementById("chatsTab").classList.toggle("active", isChats);
    document.getElementById("friendsTab").classList.toggle("active", !isChats);
    document.getElementById("chat-list").classList.toggle("hidden", !isChats);
    document.getElementById("friends-list").classList.toggle("hidden", isChats);
    document.getElementById("add-chat").classList.toggle("hidden", !isChats);
    document.getElementById("add-friend").classList.toggle("hidden", isChats);

    if (!isChats) loadFriends();
}


// ─── Chats ────────────────────────────────────────────────────────────────────

async function loadChats() {
    const chatList = document.getElementById("chat-list");

    let chats = [];
    try {
        chats = await getChats(getToken());
    } catch {
        chatList.innerHTML = "<div class='empty-state'>Failed to load chats.</div>";
        return;
    }

    if (!chats.length) {
        chatList.innerHTML = "<div class='empty-state'>No chats yet.</div>";
        return;
    }

    chatList.innerHTML = "";
    chats.forEach((chat) => {
        const name = chat.participants.length === 2
            ? chat.participants.find((p) => p._id !== currentUser._id)?.username || "Chat"
            : chat.title || "Group Chat";

        const item = document.createElement("div");
        item.className = "chat-item";
        item.textContent = name;
        item.addEventListener("click", () => {
            currentChatId = chat._id;
            document.querySelector(".chat-header").textContent = name;
            document.querySelectorAll(".chat-item").forEach((el) => el.classList.remove("active"));
            item.classList.add("active");
            loadMessages(chat._id);
        });

        chatList.appendChild(item);
    });
}

async function handleCreateChat() {
    const input = document.getElementById("chatUserInput");
    const username = input.value.trim();

    if (!username) {
        alert("Please enter a username.");
        return;
    }

    try {
        await createChat(getToken(), username);
        document.getElementById("addChatModal").classList.add("hidden");
        input.value = "";
        loadChats();
    } catch {
        alert("Failed to create chat. Please try again.");
    }
}


// ─── Messages ─────────────────────────────────────────────────────────────────

async function loadMessages(chatId) {
    const container = document.getElementById("messages");
    container.innerHTML = "";

    try {
        const messages = await getMessages(getToken(), chatId);

        if (!messages?.length) {
            container.innerHTML = "<div class='empty-state'>No messages yet. Say hello!</div>";
            return;
        }

        messages.forEach((msg) => {
            const type = msg.sender?._id === currentUser._id ? "sent" : "received";
            appendMessage(msg.text || msg.content, type);
        });
    } catch {
        container.innerHTML = "<div class='empty-state'>Failed to load messages.</div>";
    }
}

async function handleSendMessage() {
    const input = document.getElementById("messageInput");
    const text = input.value.trim();

    if (!text) return;
    if (!currentChatId) {
        alert("Please select a chat first.");
        return;
    }

    try {
        await sendMessage(getToken(), text, currentChatId);
        appendMessage(text, "sent");
        input.value = "";
    } catch {
        alert("Failed to send message. Please try again.");
    }
}

function appendMessage(text, type) {
    const container = document.getElementById("messages");
    const msg = document.createElement("div");
    msg.className = `message ${type}`;
    msg.textContent = text;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
}


// ─── Friends ──────────────────────────────────────────────────────────────────

async function loadFriends() {
    const list = document.getElementById("friends-list");

    let friends = [];
    try {
        friends = await getFriends(getToken());
    } catch {
        list.innerHTML = "<div class='empty-state'>Failed to load friends.</div>";
        return;
    }

    if (!friends.length) {
        list.innerHTML = "<div class='empty-state'>No friends yet.</div>";
        return;
    }

    list.innerHTML = "";
    friends.forEach((friend) => {
        const item = document.createElement("div");
        item.className = "friend-item";
        item.innerHTML = `
            <div class="friend-info">
                <div class="friend-avatar"></div>
                <div class="friend-name">${friend.username}</div>
            </div>
            <button class="remove-friend-btn">Remove</button>
        `;
        item.querySelector(".remove-friend-btn").addEventListener("click", async () => {
            try {
                await removeFriend(getToken(), friend._id);
                loadFriends();
            } catch {
                alert("Failed to remove friend.");
            }
        });
        list.appendChild(item);
    });
}


// ─── Friend Requests ──────────────────────────────────────────────────────────

async function openRequestsModal() {
    try {
        const requests = await getFriendRequests(getToken());
        renderRequests(requests);
        document.getElementById("friendRequestsModal").classList.remove("hidden");
    } catch {
        alert("Failed to load friend requests.");
    }
}

function renderRequests(requests) {
    const list = document.getElementById("friendRequestsList");

    if (!requests.length) {
        list.innerHTML = "<div class='empty-state'>No friend requests.</div>";
        return;
    }

    list.innerHTML = "";
    requests.forEach((req) => {
        const isIncoming = req.direction === "received";
        const item = document.createElement("div");
        item.className = "friend-request-item";
        item.innerHTML = `
            <div class="request-info">
                <div class="requester-avatar"></div>
                <div>
                    <div class="requester-name">${req.username}</div>
                    <div class="request-direction">${isIncoming ? "Incoming" : "Outgoing"}</div>
                </div>
            </div>
            ${isIncoming
                ? `<div class="request-actions">
                    <button class="accept" data-id="${req.id}">Accept</button>
                    <button class="decline" data-id="${req.id}">Decline</button>
                   </div>`
                : `<div class="request-status">Pending</div>`
            }
        `;

        if (isIncoming) {
            item.querySelector(".accept").addEventListener("click", () => handleRequestResponse(req.id, "accept"));
            item.querySelector(".decline").addEventListener("click", () => handleRequestResponse(req.id, "decline"));
        }

        list.appendChild(item);
    });
}

async function handleRequestResponse(requestId, action) {
    try {
        await respondToFriendRequest(getToken(), requestId, action);
        openRequestsModal();
        refreshBadge();
        if (action === "accept") loadFriends();
    } catch {
        alert(`Failed to ${action} request.`);
    }
}

async function refreshBadge() {
    const badge = document.getElementById("requestsBadge");
    try {
        const requests = await getFriendRequests(getToken());
        const count = requests.filter((r) => r.direction === "received").length;
        badge.textContent = count;
        badge.classList.toggle("hidden", count === 0);
    } catch {
        badge.classList.add("hidden");
    }
}


// ─── Add Friend Search ────────────────────────────────────────────────────────

async function handleUserSearch(query) {
    const results = document.getElementById("searchResults");

    if (query.length < 2) {
        results.innerHTML = "";
        return;
    }

    try {
        const users = await searchUsers(getToken(), query);

        if (!users.length) {
            results.innerHTML = "<div class='search-result-item'>No users found.</div>";
            return;
        }

        results.innerHTML = "";
        users.forEach((user) => {
            const item = document.createElement("div");
            item.className = "search-result-item";
            item.innerHTML = `
                <div class="user-info">
                    <div class="user-avatar"></div>
                    <div class="user-name">${user.username}</div>
                </div>
                <button class="add-friend-btn">Add Friend</button>
            `;
            item.querySelector(".add-friend-btn").addEventListener("click", async (e) => {
                try {
                    await sendFriendRequest(getToken(), user.username);
                    e.target.textContent = "Sent";
                    e.target.disabled = true;
                } catch {
                    alert("Failed to send friend request.");
                }
            });
            results.appendChild(item);
        });
    } catch {
        results.innerHTML = "<div class='search-result-item'>Error searching users.</div>";
    }
}