import { pool } from '../db/db.connection.js';
import { getUserByToken } from '../services/home.service.js';
import {
  sendFriendRequest,
  getFriendRequests,
  respondToFriendRequest,
  getFriends,
  removeFriend,
  searchUsers
} from '../services/friends.service.js';

const handleSendFriendRequest = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: 'Missing authorization token' });
    }

    const user = await getUserByToken(token);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { username } = req.body;
    const friendRequest = await sendFriendRequest(user.id, username);

    res.status(201).json(friendRequest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const handleGetFriendRequests = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: 'Missing authorization token' });
    }

    const user = await getUserByToken(token);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const requests = await getFriendRequests(user.id);
    res.status(200).json(requests);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const handleRespondToFriendRequest = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: 'Missing authorization token' });
    }

    const user = await getUserByToken(token);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { friendId, action } = req.body;
    const response = await respondToFriendRequest(user.id, friendId, action);

    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const handleGetFriends = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: 'Missing authorization token' });
    }

    const user = await getUserByToken(token);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const friends = await getFriends(user.id);
    res.status(200).json(friends);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const handleRemoveFriend = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: 'Missing authorization token' });
    }

    const user = await getUserByToken(token);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { friendId } = req.params;
    const result = await removeFriend(user.id, parseInt(friendId));

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const handleSearchUsers = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: 'Missing authorization token' });
    }

    const user = await getUserByToken(token);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const users = await searchUsers(q, user.id);
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export {
  handleSendFriendRequest,
  handleGetFriendRequests,
  handleRespondToFriendRequest,
  handleGetFriends,
  handleRemoveFriend,
  handleSearchUsers
};