import { login, register, getUserByToken } from '../services/home.service.js';

const handlerLogin = async (req, res) => {
  try {
    const userToken = await login(req.body);
    res.status(200).json(userToken);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const handleRegister = async (req, res) => {
  try {
    const newUser = await register(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: 'Missing authorization token' });
    }

    const userProfile = await getUserByToken(token);
    res.status(200).json(userProfile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export { handlerLogin, handleRegister, getUserProfile }