import express from 'express';
import {
  handleSendFriendRequest,
  handleGetFriendRequests,
  handleRespondToFriendRequest,
  handleGetFriends,
  handleRemoveFriend,
  handleSearchUsers
} from '../controllers/friends.controller.js';

const router = express.Router();

router.post('/request', handleSendFriendRequest);
router.get('/requests', handleGetFriendRequests);
router.post('/respond', handleRespondToFriendRequest);
router.get('/', handleGetFriends);
router.delete('/:friendId', handleRemoveFriend);
router.get('/search', handleSearchUsers);

export default router;