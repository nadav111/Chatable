import { login, register, getUserProfile } from '../services/home.service.js';

const handlerLogin = async (req, res) => {
  try {
    const userToken = await login(req.body.username, req.body.password);

    res.status(200).json(userToken);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const handleRegister = async (req, res) => {
  try {
    const newUser = await register(req.body.username, req.body.email, req.body.password);

    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const handleGetUserProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Missing authorization token' });
    }

    const userProfile = await getUserProfile(token);
    console.log("User profile:", userProfile);
    
    res.status(200).json(userProfile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export { handlerLogin, handleRegister, handleGetUserProfile }