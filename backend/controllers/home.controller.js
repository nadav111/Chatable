import { login, register, getUserProfile } from '../services/home.service.js';

const handlerLogin = async (req, res, next) => {
  try {
    const userToken = await login(req.body.username, req.body.password);
    res.status(200).json(userToken);
  } catch (err) {
    next(err);
  }
};

const handleRegister = async (req, res, next) => {
  try {
    const newUser = await register(
      req.body.username,
      req.body.email,
      req.body.password
    );

    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};

const handleGetUserProfile = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      const err = new Error("Missing authorization token");
      err.status = 401;
      throw err;
    }

    const userProfile = await getUserProfile(token);

    console.log("User profile:", userProfile);

    res.status(200).json(userProfile);
  } catch (err) {
    next(err);
  }
};

export { handlerLogin, handleRegister, handleGetUserProfile };