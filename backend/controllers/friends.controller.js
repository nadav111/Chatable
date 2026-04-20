import {
  sendFriendRequest,
  getFriendRequests,
  respondToFriendRequest,
  getFriends,
  removeFriend,
  searchUsers
} from '../services/friends.service.js';

// Extract token
const getToken = (req) => req.headers.authorization?.split(" ")[1];

// SEND FRIEND REQUEST
const handleSendFriendRequest = async (req, res, next) => {
  try {
    const token = getToken(req);

    if (!token) {
      const err = new Error("Missing authorization token");
      err.status = 401;
      throw err;
    }

    const friendRequest = await sendFriendRequest(
      token,
      req.body.username
    );

    res.status(201).json(friendRequest);
  } catch (err) {
    next(err);
  }
};

// GET FRIEND REQUESTS
const handleGetFriendRequests = async (req, res, next) => {
  try {
    const token = getToken(req);

    if (!token) {
      const err = new Error("Missing authorization token");
      err.status = 401;
      throw err;
    }

    const requests = await getFriendRequests(token);
    res.status(200).json(requests);
  } catch (err) {
    next(err);
  }
};

// RESPOND TO FRIEND REQUEST
const handleRespondToFriendRequest = async (req, res, next) => {
  try {
    const token = getToken(req);

    if (!token) {
      const err = new Error("Missing authorization token");
      err.status = 401;
      throw err;
    }

    const { friendId, action } = req.body;

    const response = await respondToFriendRequest(
      token,
      friendId,
      action
    );

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

// GET FRIENDS
const handleGetFriends = async (req, res, next) => {
  try {
    const token = getToken(req);

    if (!token) {
      const err = new Error("Missing authorization token");
      err.status = 401;
      throw err;
    }

    const friends = await getFriends(token);
    res.status(200).json(friends);
  } catch (err) {
    next(err);
  }
};

// REMOVE FRIEND
const handleRemoveFriend = async (req, res, next) => {
  try {
    const token = getToken(req);

    if (!token) {
      const err = new Error("Missing authorization token");
      err.status = 401;
      throw err;
    }

    const { friendId } = req.params;

    const result = await removeFriend(token, parseInt(friendId));

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// SEARCH USERS
const handleSearchUsers = async (req, res, next) => {
  try {
    const token = getToken(req);

    if (!token) {
      const err = new Error("Missing authorization token");
      err.status = 401;
      throw err;
    }

    const { q } = req.query;

    if (!q || q.length < 2) {
      const err = new Error("Search query must be at least 2 characters");
      err.status = 400;
      throw err;
    }

    const users = await searchUsers(token, q);
    res.status(200).json(users);
  } catch (err) {
    next(err);
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