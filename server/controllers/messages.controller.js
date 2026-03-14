import { sendMessage } from '../services/messages.service.js';

const handlerSendMessage = async (req, res) => {
  const userToken = await sendMessage(req.body);
  res.status(200).json(userToken);
};


export { handlerSendMessage }