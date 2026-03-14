import { login, register } from '../services/home.service.js';

const handlerLogin = async (req, res) => {
  const userToken = await login(req.body);
  res.status(200).json(userToken);
};

const handleRegister = async (req, res) => {
  console.log(req.body);
  
  const newUser = await register(req.body);
  res.status(201).json(newUser);
};

export { handlerLogin, handleRegister }