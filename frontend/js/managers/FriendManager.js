import { state } from "../utils/state.js";
import { getFriends, removeFriend, getFriendRequests, respondToFriendRequest, sendFriendRequest, searchUsers } from "../../lib/api.js";
import { showError, showSuccess } from "../../lib/toast.js";
import ChatManager from "./ChatManager.js";

class FriendManager {
    async loadFriends() {
        const list = document.getElementById("friends-list");
        try {
            const friends = await getFriends(state.getToken());

            if (!friends.length) {
                list.innerHTML = "<div class='empty-state'>No friends yet.</div>";
                return;
            }

            list.innerHTML = "";
            friends.forEach((friend) => this.renderFriend(friend, list));
        } catch {
            list.innerHTML = "<div class='empty-state'>Error loading friends.</div>";
        }
    }

    renderFriend(friend, list) {
        const item = document.createElement("div");
        item.className = "friend-item";

        item.innerHTML = `
            <div class="friend-info">
                <div class="friend-avatar"></div>
                <div class="friend-details">
                    <div class="friend-name">${friend.username}</div>
                </div>
            </div>

            <button class="remove-friend-btn" title="Remove friend">
                <span class="material-icons">close</span>
            </button>
        `;

        item.querySelector(".remove-friend-btn").addEventListener("click", async (e) => {
            e.stopPropagation();
            const confirmed = await this.areYouSureModal(`Are you sure you want to remove ${friend.username} from your friends?`);
            
            if (confirmed) {
                await this.removeFriendHandler(friend.id);
            }
        });


        item.addEventListener("click", () => {
            ChatManager.selectChat(friend.chatId, friend.username, item);
        });

        list.appendChild(item);
    }
    
    async removeFriendHandler(friendId) {
        try {
            await removeFriend(state.getToken(), friendId);
            this.loadFriends();
            showSuccess("Friend removed!");
        } catch {
            showError("Failed to remove friend.");
        }
    }

    async loadFriendsForGroupCreation() {
        const friendsList = document.getElementById("friendsList");
        friendsList.innerHTML = "";

        try {
            const friends = await getFriends(state.getToken());

            if (!friends.length) {
                friendsList.innerHTML = "<div class='empty-state'>No friends to add.</div>";
                return;
            }

            friends.forEach((friend) => this.renderFriendCheckbox(friend, friendsList));
        } catch {
            friendsList.innerHTML = "<div class='empty-state'>Error loading friends.</div>";
        }
    }

    renderFriendCheckbox(friend, parent) {
        const label = document.createElement("label");
        label.style.cssText = "display: flex; align-items: center; padding: 8px; cursor: pointer;";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = friend.username;
        checkbox.style.marginRight = "8px";
        checkbox.addEventListener("change", this.updateCreateButton);

        const span = document.createElement("span");
        span.textContent = friend.username;

        label.appendChild(checkbox);
        label.appendChild(span);
        parent.appendChild(label);
    }

    updateCreateButton() {
        const checked = document.querySelectorAll("#friendsList input[type='checkbox']:checked").length;
        const hasName = document.getElementById("groupNameInput")?.value.trim().length > 0;
        document.getElementById("createChatBtn").disabled = checked === 0 || !hasName;
    }
    
    getSelectedFriendsUsernames() {
        const checkboxes = document.querySelectorAll("#friendsList input[type='checkbox']:checked");
        return Array.from(checkboxes).map((cb) => cb.value);
    }

    async loadFriendRequests() {
        try {
            const requests = await getFriendRequests(state.getToken());
            this.renderRequests(requests);
            document.getElementById("friendRequestsModal").classList.remove("hidden");
        } catch {
            showError("Failed to load friend requests.");
        }
    }

    renderRequests(requests) {
        const list = document.getElementById("friendRequestsList");

        if (!requests.length) {
            list.innerHTML = "<div class='empty-state'>No friend requests.</div>";
            return;
        }

        list.innerHTML = "";
        requests.forEach((req) => this.renderRequest(req, list));
    }

    renderRequest(req, list) {
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
            item.querySelector(".accept").addEventListener("click", () => this.handleResponse(req.id, "accept"));
            item.querySelector(".decline").addEventListener("click", () => this.handleResponse(req.id, "decline"));
        }

        list.appendChild(item);
    }

    async handleResponse(requestId, action) {
        try {
            await respondToFriendRequest(state.getToken(), requestId, action);
            if (action === "accept") await this.loadFriends();
            await this.loadFriendRequests();
            await this.refreshBadge();
            showSuccess(`Request ${action}ed!`);
        } catch {
            showError(`Failed to ${action} request.`);
        }
    }

    async refreshBadge() {
        const badge = document.getElementById("requestsBadge");
        try {
            const requests = await getFriendRequests(state.getToken());
            const count = requests.filter((r) => r.direction === "received").length;
            badge.textContent = count;
            badge.classList.toggle("hidden", count === 0);
        } catch {
            badge.classList.add("hidden");
        }
    }

    async searchUsers(query) {
        const results = document.getElementById("searchResults");

        if (query.length < 2) {
            results.innerHTML = "";
            return;
        }

        try {
            const users = await searchUsers(state.getToken(), query);

            if (!users.length) {
                results.innerHTML = "<div class='search-result-item'>No users found.</div>";
                return;
            }

            results.innerHTML = "";
            users.forEach((user) => this.renderUserResult(user, results));
        } catch {
            results.innerHTML = "<div class='search-result-item'>Error searching.</div>";
        }
    }

    renderUserResult(user, results) {
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
            await this.sendFriendRequestHandler(user.username, e.target);
        });
        results.appendChild(item);
    }

    async sendFriendRequestHandler(username, button) {
        try {
            await sendFriendRequest(state.getToken(), username);
            button.textContent = "Sent";
            button.disabled = true;
            showSuccess("Request sent!");
        } catch {
            showError("Failed to send request.");
        }
    }

    async areYouSureModal(message = "Are you sure?") {
        return new Promise((resolve) => {
            const modal = document.createElement("div");
            modal.className = "modal";

            modal.innerHTML = `
                <div class="modal-overlay"></div>

                <div class="modal-content" style="max-width: 360px;">
                    <div class="modal-header">
                        <h2>Confirm</h2>
                    </div>

                    <div class="modal-body">
                        <p style="color:#374151; font-size:14px;">
                            ${message}
                        </p>
                    </div>

                    <div class="modal-footer">
                        <button class="secondary-btn cancel-btn">Cancel</button>
                        <button class="primary-btn confirm-btn" style="background:#dc2626;">
                            Yes, remove
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            const close = () => {
                modal.remove();
            };

            modal.querySelector(".cancel-btn").addEventListener("click", () => {
                close();
                resolve(false);
            });

            modal.querySelector(".modal-overlay").addEventListener("click", () => {
                close();
                resolve(false);
            });

            modal.querySelector(".confirm-btn").addEventListener("click", () => {
                close();
                resolve(true);
            });
        });
    }
}

export default new FriendManager();
