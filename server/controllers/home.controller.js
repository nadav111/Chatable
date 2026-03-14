import { login, register, getUserByToken } from '../services/home.service.js';

const handlerLogin = async (req, res) => {
  const userToken = await login(req.body);
  res.status(200).json(userToken);
};

const handleRegister = async (req, res) => {
  const newUser = await register(req.body);
  res.status(201).json(newUser);
};

const getUserProfile = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  const userProfile = await getUserByToken(token);
  res.status(200).json(userProfile);
};

export { handlerLogin, handleRegister, getUserProfile }